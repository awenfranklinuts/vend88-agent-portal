/** Default password format for new logins handed to merchants: "Vend" + 4 random digits, e.g. Vend4821 */
export const generateVendPassword = () => `Vend${Math.floor(1000 + Math.random() * 9000)}`;
