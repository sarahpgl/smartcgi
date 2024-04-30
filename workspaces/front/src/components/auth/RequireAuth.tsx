/*import { useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/isConnected`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ access_token: token }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setIsAuthenticated(result.success);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de la connexion:', error);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        verifyUser();
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>; // Ou un composant de chargement
    }

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/register" replace state={{ path: location.pathname }} />
    );
}

export default RequireAuth;*/

import { useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/isConnected`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ access_token: token }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setIsAuthenticated(result.success);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de la connexion:', error);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        verifyUser();
    }, []);

    useEffect(() => {
        if (!isAuthenticated && !isLoading && !redirecting) {
            alert("Vous devez être connecté pour accéder à ces pages");
            setRedirecting(true);
        }
    }, [isAuthenticated, isLoading, redirecting]);

    if (isLoading) {
        return <div>Chargement...</div>; // Ou un composant de chargement
    }

    if (!isAuthenticated && redirecting) {
        return <Navigate to="/register" />;
    }

    return children;
}

export default RequireAuth;
