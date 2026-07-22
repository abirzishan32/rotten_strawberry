import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { profilesApi, type ProfilePatch } from '@/services/supabase';
import { useUserId } from '@/store/auth-store';

/** The current user's profile, or another user's if an id is passed. */
export function useProfile(userIdArg?: string) {
  const currentUserId = useUserId();
  const userId = userIdArg ?? currentUserId;
  return useQuery({
    queryKey: queryKeys.profile(userId ?? 'anon'),
    queryFn: () => profilesApi.getProfile(userId as string),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: ProfilePatch) => {
      if (!userId) throw new Error('You must be signed in to edit your profile.');
      return profilesApi.updateProfile(userId, patch);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile(profile.id), profile);
    },
  });
}
