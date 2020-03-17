"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handle refresh tokens for jwt auth.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util_1 = require("util");
const http_errors_1 = __importDefault(require("http-errors"));
const uuid_1 = require("uuid");
const prisma_client_1 = require("../../prisma/generated/prisma-client");
class RefreshService {
    constructor(fastify) {
        this.instance = fastify;
    }
    async verifyToken(token) {
        const verify = util_1.promisify(this.instance.jwt.verify);
        try {
            const userProfile = await verify(token);
            return userProfile;
        }
        catch (err) {
            throw new http_errors_1.default.Unauthorized(err.message);
        }
    }
    async generateToken(userProfile, session = true) {
        if (!userProfile) {
            throw new http_errors_1.default.Unauthorized(`Помилка генерації токену, профіль користувача відсутній.`);
        }
        const expiresIn = session
            ? Number(this.instance.config.JWT_SESSION_EXPIRES_IN)
            : Number(this.instance.config.JWT_REFRESH_EXPIRES_IN);
        /** Prepare data for token */
        const tokenData = {
            id: userProfile.id,
            email: userProfile.email,
            role: userProfile.role,
            hash: userProfile.hash || uuid_1.v4(),
        };
        try {
            /** Generate token */
            const token = this.instance.jwt.sign(tokenData, {
                expiresIn,
            });
            if (userProfile.hash) {
                /**
                 * If userProfile has property 'hash'
                 * its mean that user already logged in
                 * and in this case just need to update token in db.
                 */
                await prisma_client_1.prisma.updateToken({
                    data: {
                        token,
                    },
                    where: {
                        loginId: userProfile.hash,
                    },
                });
                this.instance.log.debug('updateToken');
            }
            else {
                /**
                 * If userProfile doesn't have property 'hash'
                 * its mean that user isn't logged in
                 * in this case need to create new record in db.
                 */
                await prisma_client_1.prisma.createToken({
                    token,
                    loginId: tokenData.hash,
                    user: {
                        connect: { id: userProfile.id },
                    },
                });
                this.instance.log.debug('createToken');
            }
            return token;
        }
        catch (err) {
            throw new http_errors_1.default.Unauthorized(`Помилка генерації токену: ${err.message}`);
        }
    }
}
module.exports = RefreshService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcmVzaC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3NlcnZpY2VzL3JlZnJlc2gtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7Ozs7QUFJSCwrQkFBaUM7QUFDakMsOERBQXFDO0FBQ3JDLCtCQUFvQztBQUlwQyx3RUFBOEQ7QUFFOUQsTUFBTSxjQUFjO0lBR2hCLFlBQVksT0FBd0I7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBYTtRQUMzQixNQUFNLE1BQU0sR0FBRyxnQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELElBQUk7WUFDQSxNQUFNLFdBQVcsR0FBZ0IsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFnQixDQUFDO1lBRXBFLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixNQUFNLElBQUkscUJBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBd0IsRUFBRSxVQUFtQixJQUFJO1FBQ2pFLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxNQUFNLElBQUkscUJBQVUsQ0FBQyxZQUFZLENBQzdCLDBEQUEwRCxDQUM3RCxDQUFDO1NBQ0w7UUFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPO1lBQ3JCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7WUFDckQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRTFELDZCQUE2QjtRQUM3QixNQUFNLFNBQVMsR0FBRztZQUNkLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRTtZQUNsQixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7WUFDeEIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO1lBQ3RCLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxJQUFJLFNBQU0sRUFBRTtTQUNyQyxDQUFDO1FBRUYsSUFBSTtZQUNBLHFCQUFxQjtZQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUM1QyxTQUFTO2FBQ1osQ0FBQyxDQUFDO1lBRUgsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO2dCQUNsQjs7OzttQkFJRztnQkFDSCxNQUFNLHNCQUFNLENBQUMsV0FBVyxDQUFDO29CQUNyQixJQUFJLEVBQUU7d0JBQ0YsS0FBSztxQkFDUjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJO3FCQUM1QjtpQkFDSixDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzFDO2lCQUFNO2dCQUNIOzs7O21CQUlHO2dCQUNILE1BQU0sc0JBQU0sQ0FBQyxXQUFXLENBQUM7b0JBQ3JCLEtBQUs7b0JBQ0wsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUN2QixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUU7cUJBQ2xDO2lCQUNKLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDMUM7WUFFRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsTUFBTSxJQUFJLHFCQUFVLENBQUMsWUFBWSxDQUM3Qiw2QkFBNkIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUM3QyxDQUFDO1NBQ0w7SUFDTCxDQUFDO0NBQ0o7QUFFRCxpQkFBUyxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnk6IE9sZWtzYW5kciBCZXpydWtvdlxuICogQ3JlYXRpb24gZGF0ZTogOSBNYXJjaCAyMDIwXG4gKlxuICogU2VydmljZSB3aGljaCBoYW5kbGUgcmVmcmVzaCB0b2tlbnMgZm9yIGp3dCBhdXRoLlxuICovXG5cbi8qKiBFeHRlcm5hbCBpbXBvcnRzICovXG5pbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UgfSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IEh0dHBFcnJvcnMgZnJvbSAnaHR0cC1lcnJvcnMnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5cbi8qKiBBcHBsaWNhdGlvbidzIGltcG9ydHMgKi9cbmltcG9ydCB7IFVzZXJQcm9maWxlIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4uLy4uL3ByaXNtYS9nZW5lcmF0ZWQvcHJpc21hLWNsaWVudCc7XG5cbmNsYXNzIFJlZnJlc2hTZXJ2aWNlIHtcbiAgICBpbnN0YW5jZSE6IEZhc3RpZnlJbnN0YW5jZTtcblxuICAgIGNvbnN0cnVjdG9yKGZhc3RpZnk6IEZhc3RpZnlJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gZmFzdGlmeTtcbiAgICB9XG5cbiAgICBhc3luYyB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICAgICAgICBjb25zdCB2ZXJpZnkgPSBwcm9taXNpZnkodGhpcy5pbnN0YW5jZS5qd3QudmVyaWZ5KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJQcm9maWxlOiBVc2VyUHJvZmlsZSA9IGF3YWl0IHZlcmlmeSh0b2tlbikgYXMgVXNlclByb2ZpbGU7XG5cbiAgICAgICAgICAgIHJldHVybiB1c2VyUHJvZmlsZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSHR0cEVycm9ycy5VbmF1dGhvcml6ZWQoZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVUb2tlbih1c2VyUHJvZmlsZTogVXNlclByb2ZpbGUsIHNlc3Npb246IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF1c2VyUHJvZmlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEh0dHBFcnJvcnMuVW5hdXRob3JpemVkKFxuICAgICAgICAgICAgICAgIGDQn9C+0LzQuNC70LrQsCDQs9C10L3QtdGA0LDRhtGW0Zcg0YLQvtC60LXQvdGDLCDQv9GA0L7RhNGW0LvRjCDQutC+0YDQuNGB0YLRg9Cy0LDRh9CwINCy0ZbQtNGB0YPRgtC90ZbQuS5gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHNlc3Npb25cbiAgICAgICAgICAgID8gTnVtYmVyKHRoaXMuaW5zdGFuY2UuY29uZmlnLkpXVF9TRVNTSU9OX0VYUElSRVNfSU4pXG4gICAgICAgICAgICA6IE51bWJlcih0aGlzLmluc3RhbmNlLmNvbmZpZy5KV1RfUkVGUkVTSF9FWFBJUkVTX0lOKTtcblxuICAgICAgICAvKiogUHJlcGFyZSBkYXRhIGZvciB0b2tlbiAqL1xuICAgICAgICBjb25zdCB0b2tlbkRhdGEgPSB7XG4gICAgICAgICAgICBpZDogdXNlclByb2ZpbGUuaWQsXG4gICAgICAgICAgICBlbWFpbDogdXNlclByb2ZpbGUuZW1haWwsXG4gICAgICAgICAgICByb2xlOiB1c2VyUHJvZmlsZS5yb2xlLFxuICAgICAgICAgICAgaGFzaDogdXNlclByb2ZpbGUuaGFzaCB8fCB1dWlkdjQoKSxcbiAgICAgICAgfTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqIEdlbmVyYXRlIHRva2VuICovXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuaW5zdGFuY2Uuand0LnNpZ24odG9rZW5EYXRhLCB7XG4gICAgICAgICAgICAgICAgZXhwaXJlc0luLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh1c2VyUHJvZmlsZS5oYXNoKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdXNlclByb2ZpbGUgaGFzIHByb3BlcnR5ICdoYXNoJ1xuICAgICAgICAgICAgICAgICAqIGl0cyBtZWFuIHRoYXQgdXNlciBhbHJlYWR5IGxvZ2dlZCBpblxuICAgICAgICAgICAgICAgICAqIGFuZCBpbiB0aGlzIGNhc2UganVzdCBuZWVkIHRvIHVwZGF0ZSB0b2tlbiBpbiBkYi5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBhd2FpdCBwcmlzbWEudXBkYXRlVG9rZW4oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luSWQ6IHVzZXJQcm9maWxlLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluc3RhbmNlLmxvZy5kZWJ1ZygndXBkYXRlVG9rZW4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdXNlclByb2ZpbGUgZG9lc24ndCBoYXZlIHByb3BlcnR5ICdoYXNoJ1xuICAgICAgICAgICAgICAgICAqIGl0cyBtZWFuIHRoYXQgdXNlciBpc24ndCBsb2dnZWQgaW5cbiAgICAgICAgICAgICAgICAgKiBpbiB0aGlzIGNhc2UgbmVlZCB0byBjcmVhdGUgbmV3IHJlY29yZCBpbiBkYi5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBhd2FpdCBwcmlzbWEuY3JlYXRlVG9rZW4oe1xuICAgICAgICAgICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgICAgICAgICAgbG9naW5JZDogdG9rZW5EYXRhLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IHsgaWQ6IHVzZXJQcm9maWxlLmlkIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluc3RhbmNlLmxvZy5kZWJ1ZygnY3JlYXRlVG9rZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIdHRwRXJyb3JzLlVuYXV0aG9yaXplZChcbiAgICAgICAgICAgICAgICBg0J/QvtC80LjQu9C60LAg0LPQtdC90LXRgNCw0YbRltGXINGC0L7QutC10L3RgzogJHtlcnIubWVzc2FnZX1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0ID0gUmVmcmVzaFNlcnZpY2U7XG4iXX0=