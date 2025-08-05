import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("/register", "./routes/auth/signup.tsx"),
    route("/login", "./routes/auth/signin.tsx"),

    route("appointments", "layout/appLayout.tsx", [
        index("./routes/appointments/list.tsx"),
        route("create", "./routes/appointments/create.tsx"),
        route("edit/:id", "./routes/appointments/edit.tsx"),
        route("view/:id", "./routes/appointments/view.tsx"),

        // RESOURCE
        route("action", "./routes/appointments/actions.tsx"),
    ]),

    // layout("layout/appLayout.tsx", [route("appointments/:id", "./routes/appointments/view.tsx")]),
] satisfies RouteConfig;
