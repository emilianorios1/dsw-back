import { auth, claimIncludes } from "express-oauth2-jwt-bearer"

export const checkAuth = auth({})
export const checkAdmin = claimIncludes('permissions', 'admin')
