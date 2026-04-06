/**
 * Format a role string to human-readable title case
 * @param role The role string (e.g., "super_admin", "admin", "agent")
 * @returns Formatted role (e.g., "Super Admin", "Admin", "Agent")
 */
export function formatRole(role: string | undefined | null): string {
  if (!role) return "";
  
  switch (role.toLowerCase()) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "agent":
      return "Agent";
    default:
      // Fallback: capitalize first letter of each word
      return role
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}
