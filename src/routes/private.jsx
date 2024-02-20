import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/loader";

const Profile = lazy(() => import("../pages/private/profile"));
const UserPage = lazy(() => import("../pages/common/user"));
const AdminDashboard = lazy(() => import("../pages/private/admin/dashboard"));
const InternalUserLayoutComponent = lazy(() =>
	import("../components/InternalUserLayout/InternalUserLayout")
);
const Products = lazy(() => import("../pages/private/admin/products/index"))


export function UserApp() {
  return (
    <Routes>
      <Route path="/profileData" caseSensitive element={<Profile />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="*" element={<Navigate to={"/profileData"} replace />} />
    </Routes>
  );
}


const operationAdminPaths = [
	{
		path: "/admin",
		element: InternalUserLayoutComponent,
		children: [
			// {
			// 	path: "user",
			// 	element: AdminDashboard,
			// },
			{
				path: "products",
				element: Products,
			}
		],
	},
];

export function AdminApp() {
  return (
    // <Routes>
    //   <Route path="/" element={<AdminDashboard />} />
    //   <Route path="*" element={<Navigate to={"/"} replace />} />
    // </Routes>
    <Routes>
			{operationAdminPaths.map((parentElement, index) => (
				<Route
					key={index}
					path={parentElement.path}
					element={<parentElement.element />}>
					{parentElement.children.map((element, index) => (
						<Route
							key={index}
							path={element.path}
							element={
								<Suspense fallback={<Loader />}>
									<element.element />
								</Suspense>
							}
						/>
					))}
				</Route>
			))}
			<Route
				path="*"
				element={<Navigate to="/" replace />}
			/>
		</Routes>
  );
}
