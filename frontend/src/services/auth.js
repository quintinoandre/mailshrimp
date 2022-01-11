const TOKEN_KEY = 'mailshrimp-token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isAuthenticated = getToken() !== null;

const login = (token) => {
	localStorage.setItem(TOKEN_KEY, token);
};

const logout = () => {
	localStorage.removeItem(TOKEN_KEY);
};

export { TOKEN_KEY, getToken, isAuthenticated, login, logout };
