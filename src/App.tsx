import { AuthBindings, Authenticated, Refine } from '@refinedev/core'
import { DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from '@refinedev/mui'

import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6'
import dataProvider from '@refinedev/simple-rest'
import axios, { AxiosRequestConfig } from 'axios'
import { CredentialResponse } from 'interfaces/google'

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { parseJwt } from 'utils/parse-jwt'
import { Header } from './components/header'
import { ColorModeContextProvider } from './contexts/color-mode'
import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  DashboardOutlined,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from '@mui/icons-material'

import {
  Login,
  Agents,
  MyProfile,
  PropertyDetails,
  AllProperties,
  CreateProperty,
  AgentProfile,
  EditProperty,
  DashboardPage,
} from './pages'

const axiosInstance = axios.create()
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return request
})

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null

      if (profileObj) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        )

        localStorage.setItem('token', `${credential}`)

        return {
          success: true,
          redirectTo: '/',
        }
      }

      return {
        success: false,
      }
    },
    logout: async () => {
      const token = localStorage.getItem('token')

      if (token && typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        axios.defaults.headers.common = {}
        window.google?.accounts.id.revoke(token, () => {
          return {}
        })
      }

      return {
        success: true,
        redirectTo: '/login',
      }
    },
    onError: async (error) => {
      console.error(error)
      return { error }
    },
    check: async () => {
      const token = localStorage.getItem('token')

      if (token) {
        return {
          authenticated: true,
        }
      }

      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem('user')
      if (user) {
        return JSON.parse(user)
      }

      return null
    },
  }

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
                notificationProvider={notificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: 'i9HfQX-FjH15R-OfEqFp',
                }}
                resources={[
                  {
                    name: 'dashboard',
                    list: '/',
                    meta: {
                      label: 'Dashboard',
                      icon: <DashboardOutlined />,
                    },
                  },
                  {
                    name: 'properties',
                    list: AllProperties,
                    show: PropertyDetails,
                    create: CreateProperty,
                    edit: EditProperty,
                    icon: <VillaOutlined />,
                  },
                  {
                    name: 'agents',
                    list: Agents,
                    show: AgentProfile,
                    icon: <PeopleAltOutlined />,
                  },
                  {
                    name: 'reviews',
                    list: DashboardPage,
                    icon: <StarOutlineRounded />,
                  },
                  {
                    name: 'messages',
                    list: DashboardPage,
                    icon: <ChatBubbleOutline />,
                  },
                  {
                    name: 'my-profile',
                    options: { label: 'My Profile ' },
                    list: MyProfile,
                    icon: <AccountCircleOutlined />,
                  },
                ]}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header isSticky={true} />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index element={<DashboardPage />} />

                    <Route path="/properties">
                      <Route index element={<AllProperties />} />
                      <Route path="create" element={<CreateProperty />} />
                      <Route path="edit/:id" element={<EditProperty />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
