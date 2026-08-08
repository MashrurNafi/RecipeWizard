export const authState = {
  isSignedIn: true,
  isLoaded: true,
  userId: "user-1",
  user: { id: "user-1", firstName: "Test", imageUrl: null as string | null },
  getToken: async () => "test-token" as string | null,
}
