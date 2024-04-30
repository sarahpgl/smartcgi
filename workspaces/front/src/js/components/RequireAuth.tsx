import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from '@app/services/AuthService';


function RequireAuth({ children }) {
    const location = useLocation();
  
    return AuthService.isAuthenticatedUser() === true ? (
      children
    ) : (
      <Navigate to="/register" replace state={{ path: location.pathname }} />
    );
  }

export default RequireAuth;