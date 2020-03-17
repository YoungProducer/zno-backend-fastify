"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Access service to generate and verify access tokens.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_errors_1 = __importDefault(require("http-errors"));
const lodash_1 = __importDefault(require("lodash"));
class AccessService {
    constructor(fastify) {
        this.instance = fastify;
    }
    async generateToken(userProfile, session = false) {
        const expiresIn = session
            ? this.instance.config.JWT_SESSION_EXPIRES_IN
            : this.instance.config.JWT_ACCESS_EXPIRES_IN;
        const token = this.instance.jwt.sign(lodash_1.default.omit(userProfile, ['iat', 'exp']), {
            expiresIn: Number(expiresIn),
        });
        return token;
    }
    async verifyToken(token) {
        const userProfile = this.instance.jwt.verify(token);
        if (!userProfile) {
            throw new http_errors_1.default.Unauthorized('Профіль користувача відсутній.');
        }
        return userProfile;
    }
}
module.exports = AccessService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc2VydmljZXMvYWNjZXNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7O0FBSUgsOERBQXFDO0FBQ3JDLG9EQUF1QjtBQUt2QixNQUFNLGFBQWE7SUFHZixZQUFZLE9BQXdCO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQXdCLEVBQUUsVUFBbUIsS0FBSztRQUNsRSxNQUFNLFNBQVMsR0FBRyxPQUFPO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0I7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1FBRWpELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0RSxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUMvQixDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFhO1FBQzNCLE1BQU0sV0FBVyxHQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNkLE1BQU0sSUFBSSxxQkFBVSxDQUFDLFlBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBRUQsaUJBQVMsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5OiBPbGVrc2FuZHIgQmV6cnVrb3ZcbiAqIENyZWF0aW9uIGRhdGU6IDkgTWFyY2ggMjAyMFxuICpcbiAqIEFjY2VzcyBzZXJ2aWNlIHRvIGdlbmVyYXRlIGFuZCB2ZXJpZnkgYWNjZXNzIHRva2Vucy5cbiAqL1xuXG4vKiogRXh0ZXJuYWwgaW1wb3J0cyAqL1xuaW1wb3J0IHsgRmFzdGlmeUluc3RhbmNlIH0gZnJvbSAnZmFzdGlmeSc7XG5pbXBvcnQgSHR0cEVycm9ycyBmcm9tICdodHRwLWVycm9ycyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG4vKiogQXBwbGljYXRpb24ncyBpbXBvcnRzICovXG5pbXBvcnQgeyBVc2VyUHJvZmlsZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5jbGFzcyBBY2Nlc3NTZXJ2aWNlIHtcbiAgICBpbnN0YW5jZSE6IEZhc3RpZnlJbnN0YW5jZTtcblxuICAgIGNvbnN0cnVjdG9yKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gZmFzdGlmeTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZVRva2VuKHVzZXJQcm9maWxlOiBVc2VyUHJvZmlsZSwgc2Vzc2lvbjogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gc2Vzc2lvblxuICAgICAgICAgICAgPyB0aGlzLmluc3RhbmNlLmNvbmZpZy5KV1RfU0VTU0lPTl9FWFBJUkVTX0lOXG4gICAgICAgICAgICA6IHRoaXMuaW5zdGFuY2UuY29uZmlnLkpXVF9BQ0NFU1NfRVhQSVJFU19JTjtcblxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuaW5zdGFuY2Uuand0LnNpZ24oXy5vbWl0KHVzZXJQcm9maWxlLCBbJ2lhdCcsICdleHAnXSksIHtcbiAgICAgICAgICAgIGV4cGlyZXNJbjogTnVtYmVyKGV4cGlyZXNJbiksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG5cbiAgICBhc3luYyB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICAgICAgICBjb25zdCB1c2VyUHJvZmlsZTogVXNlclByb2ZpbGUgPSB0aGlzLmluc3RhbmNlLmp3dC52ZXJpZnkodG9rZW4pO1xuXG4gICAgICAgIGlmICghdXNlclByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIdHRwRXJyb3JzLlVuYXV0aG9yaXplZCgn0J/RgNC+0YTRltC70Ywg0LrQvtGA0LjRgdGC0YPQstCw0YfQsCDQstGW0LTRgdGD0YLQvdGW0LkuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXNlclByb2ZpbGU7XG4gICAgfVxufVxuXG5leHBvcnQgPSBBY2Nlc3NTZXJ2aWNlO1xuIl19