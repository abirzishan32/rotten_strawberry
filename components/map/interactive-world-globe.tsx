import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { CountryStat } from '@/hooks/use-map-data';

interface InteractiveWorldGlobeProps {
  countries: CountryStat[];
  maxCount: number;
  topIso?: string;
  onSelectCountry: (iso: string) => void;
}

/**
 * A real 3D globe with actual country borders. Rendered by `globe.gl` (Three.js)
 * inside a WebView: countries are extruded + choropleth-coloured by watch count,
 * the user drags to rotate and pinches to zoom, and tapping a country posts its
 * ISO code back to React Native to open the detail sheet.
 *
 * globe.gl + the Natural Earth boundaries are loaded from CDNs at runtime (the
 * app already needs the network for TMDB), so nothing large is bundled.
 */
export function InteractiveWorldGlobe({
  countries,
  maxCount,
  topIso,
  onSelectCountry,
}: InteractiveWorldGlobeProps) {
  const webRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const payload = useMemo(
    () => ({
      counts: Object.fromEntries(
        countries.map((c) => [c.iso, { count: c.moviesWatched, name: c.name }])
      ),
      maxCount,
      topIso: topIso ?? null,
    }),
    [countries, maxCount, topIso]
  );

  // Keep the latest data available to inject the moment the globe reports ready,
  // and whenever it changes afterwards (details stream in progressively).
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  const pushUpdate = () => {
    webRef.current?.injectJavaScript(
      `window.__update__ && window.__update__(${JSON.stringify(payloadRef.current)}); true;`
    );
  };

  React.useEffect(() => {
    if (ready) pushUpdate();
  }, [ready, payload]);

  const onMessage = (e: WebViewMessageEvent) => {
    const msg = e.nativeEvent.data;
    if (msg === '__ready__') {
      setReady(true);
      return;
    }
    if (msg === '__error__') {
      setFailed(true);
      return;
    }
    if (msg) onSelectCountry(msg);
  };

  const html = useMemo(() => GLOBE_HTML, []);

  return (
    <View className="flex-1 overflow-hidden">
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        injectedJavaScriptBeforeContentLoaded={`window.__DATA__ = ${JSON.stringify(payload)}; true;`}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        style={{ backgroundColor: '#070A14' }}
        onError={() => setFailed(true)}
      />

      {!ready && !failed ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator color="#00e054" />
          <Text className="mt-3 text-xs text-white/50">Rendering your world…</Text>
        </View>
      ) : null}

      {failed ? (
        <View className="absolute inset-0 items-center justify-center px-8">
          <Ionicons name="cloud-offline-outline" size={30} color="#ffffff66" />
          <Text className="mt-2 text-center text-sm text-white/60">
            Couldn&apos;t load the globe. Check your connection and try again.
          </Text>
        </View>
      ) : (
        <View pointerEvents="none" className="absolute left-0 right-0 items-center">
          <Text className="text-[11px] text-white/35">Drag to rotate · pinch to zoom · tap a country</Text>
        </View>
      )}
    </View>
  );
}

// jsDelivr mirrors GitHub with proper CORS headers (raw.githubusercontent is
// inconsistent about them), so the WebView's fetch() can read it.
const GEO_URL =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

const GLOBE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  html, body { margin:0; padding:0; height:100%; width:100%; background:#070A14; overflow:hidden; }
  #globeViz { width:100vw; height:100vh; }
  .lbl { font-family: -apple-system, Roboto, sans-serif; }
</style>
</head>
<body>
<div id="globeViz"></div>
<script src="https://unpkg.com/globe.gl"></script>
<script>
  var DATA = window.__DATA__ || { counts:{}, maxCount:0, topIso:null };
  var world, features;

  function post(m){ if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(m); }

  function isoOf(d){
    var p = d.properties || {};
    var a = (p.ISO_A2_EH && p.ISO_A2_EH !== '-99') ? p.ISO_A2_EH
          : (p.ISO_A2 && p.ISO_A2 !== '-99') ? p.ISO_A2 : null;
    return a ? a.toUpperCase() : null;
  }
  function capColor(iso){
    var c = DATA.counts[iso];
    if (!c) return 'rgba(28,38,58,0.82)';
    if (iso === DATA.topIso) return 'rgba(255,197,61,0.95)';
    var t = DATA.maxCount ? c.count / DATA.maxCount : 0;
    var g = Math.round(150 + t * 105);
    var a = (0.6 + t * 0.38).toFixed(3);
    return 'rgba(0,' + g + ',84,' + a + ')';
  }
  function alt(iso){
    var c = DATA.counts[iso];
    if (!c) return 0.008;
    var t = DATA.maxCount ? c.count / DATA.maxCount : 0;
    return 0.05 + t * 0.17;
  }
  function labelFor(d){
    var iso = isoOf(d); var c = DATA.counts[iso];
    var nm = d.properties.ADMIN || d.properties.NAME || d.properties.NAME_LONG || '';
    if (c) return '<div class="lbl" style="color:#fff;font-weight:600;font-size:13px">' + c.name + ' — ' + c.count + ' films</div>';
    return '<div class="lbl" style="color:#9aa;font-size:12px">' + nm + '</div>';
  }

  function build(){
    world = Globe()(document.getElementById('globeViz'))
      .backgroundColor('#070A14')
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
      .showAtmosphere(true)
      .atmosphereColor('#00e054')
      .atmosphereAltitude(0.16)
      .polygonsData(features)
      .polygonCapColor(function(d){ return capColor(isoOf(d)); })
      .polygonAltitude(function(d){ return alt(isoOf(d)); })
      .polygonSideColor(function(){ return 'rgba(0,224,84,0.12)'; })
      .polygonStrokeColor(function(){ return 'rgba(255,255,255,0.22)'; })
      .polygonLabel(labelFor)
      .onPolygonClick(function(d){ var iso = isoOf(d); if (iso && DATA.counts[iso]) post(iso); });

    var ctrl = world.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.5;
    ctrl.enableZoom = true;
    ctrl.enablePan = false;
    world.pointOfView({ lat: 15, lng: 10, altitude: 2.4 }, 0);
    resize();
    post('__ready__');
  }

  function resize(){ if (world){ world.width(window.innerWidth); world.height(window.innerHeight); } }
  window.addEventListener('resize', resize);

  window.__update__ = function(d){ DATA = d; if (world) world.polygonsData(features); };

  fetch('${GEO_URL}')
    .then(function(r){ return r.json(); })
    .then(function(geo){
      features = (geo.features || []).filter(function(f){ return isoOf(f) !== 'AQ'; });
      if (typeof Globe === 'undefined') { post('__error__'); return; }
      build();
    })
    .catch(function(){ post('__error__'); });
</script>
</body>
</html>`;
