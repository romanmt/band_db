defmodule BandDbWeb.Router do
  use BandDbWeb, :router

  import BandDbWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {BandDbWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin do
    plug :require_authenticated_user
    plug :require_admin_user
  end

  scope "/admin", BandDbWeb do
    pipe_through [:browser, :admin]

    live_session :admin, on_mount: [{BandDbWeb.UserAuth, :ensure_authenticated}] do
      live "/users", AdminLive.UsersLive, :index
      live "/calendar", AdminCalendarLive, :index
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", BandDbWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard in development
  if Application.compile_env(:band_db, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: BandDbWeb.Telemetry
    end
  end

  ## Authentication routes

  scope "/", BandDbWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    live_session :redirect_if_user_is_authenticated,
      on_mount: [{BandDbWeb.UserAuth, :redirect_if_user_is_authenticated}] do
      live "/users/register", UserRegistrationLive, :new
      live "/users/register/:token", UserRegistrationLive, :new
      live "/users/log_in", UserLoginLive, :new
      live "/users/reset_password", UserForgotPasswordLive, :new
      live "/users/reset_password/:token", UserResetPasswordLive, :edit
    end

    post "/users/log_in", UserSessionController, :create
  end

  # Google OAuth routes
  scope "/auth", BandDbWeb do
    pipe_through [:browser, :require_authenticated_user]

    get "/google", GoogleAuthController, :authenticate
    get "/google/callback", GoogleAuthController, :callback
    get "/google/disconnect", GoogleAuthController, :disconnect
  end

  scope "/", BandDbWeb do
    pipe_through [:browser]

    live_session :current_user,
      on_mount: [{BandDbWeb.UserAuth, :mount_current_user}] do
      live "/", PageLive, :home
      live "/users/confirm/:token", UserConfirmationLive, :edit
      live "/users/confirm", UserConfirmationInstructionsLive, :new
    end
  end

  scope "/", BandDbWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [{BandDbWeb.UserAuth, :ensure_authenticated}] do
      live "/songs", SongLive
      live "/suggested-songs", SuggestedSongsLive
      live "/rehearsal", RehearsalPlanLive
      live "/rehearsal/history", RehearsalHistoryLive
      live "/rehearsal/plan/:id", RehearsalPlanViewLive
      live "/set-list", SetListHistoryLive
      live "/set-list/new", SetListEditorLive
      live "/set-list/history", SetListHistoryLive
      live "/set-list/:name", SetListViewLive
      live "/calendar", BandCalendarLive, :index
      live "/calendar/:year/:month", BandCalendarLive, :show
      live "/users/settings", UserSettingsLive, :edit
      live "/users/settings/confirm_email/:token", UserSettingsLive, :confirm_email
    end
  end

  scope "/", BandDbWeb do
    pipe_through [:browser]

    delete "/users/log_out", UserSessionController, :delete
  end
end
