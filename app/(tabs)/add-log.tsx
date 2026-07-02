import { Redirect } from 'expo-router';
import React from 'react';

// The tab bar intercepts presses on this tab (see (tabs)/_layout.tsx) and
// pushes /add-log as a modal instead. This file only exists so the tab
// route resolves if reached directly (e.g. deep link).
export default function AddLogTabRedirect() {
  return <Redirect href="/add-log" />;
}
