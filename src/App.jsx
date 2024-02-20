import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SnackbarProvider } from "notistack";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import ErrorFallback from "./components/errorFallBack";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/store";
import RouterRender from "./routes";
import Loader from "./components/loader";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchInterval: 30_000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<Loader />}>
                <RouterRender />
              </Suspense>
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
