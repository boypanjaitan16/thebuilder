import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useFirebaseSession } from "../hooks/useFirebaseSession";
import LoadingIndicator from "./LoadingIndicator";

export function AdminGuard() {
	const location = useLocation();
	const { checking, isAuthenticated } = useFirebaseSession();

	if (checking) {
		return (
			<div className="container-page w-full flex flex-col flex-grow items-center justify-center">
				<LoadingIndicator label="Checking session…" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/admin/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
}
