interface ISessionConfig {
    store: {
        url: string
        secret: string
        touchAfter: number
    }
    name: string
    secret: string
    resave: boolean
    saveUninitialized: boolean
    cookie: {
        httpOnly: boolean,
        secure?: boolean,
        expires: Date,
        maxAge: number
    }
}