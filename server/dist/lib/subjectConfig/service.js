"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 11 March 2020
 */
/** Application's imports */
const prisma_client_1 = require("../../prisma/generated/prisma-client");
class SubjectConfigService {
    async create(config) {
        const subjectConfig = await prisma_client_1.prisma.createSubjectConfig({
            subject: {
                connect: {
                    name: config.name,
                },
            },
            themes: {
                set: config.themes || [],
            },
            exams: {
                create: {
                    sessions: {
                        set: config.exams ? config.exams.sessions : [],
                    },
                    trainings: {
                        set: config.exams ? config.exams.trainings : [],
                    },
                },
            },
            subSubjects: {
                create: config.subSubjects ? config.subSubjects.map(subject => {
                    return {
                        subject: {
                            connect: {
                                name: subject.name,
                            },
                        },
                    };
                }) : undefined,
            },
        });
        return subjectConfig;
    }
    async config(id) {
        const config = await prisma_client_1.prisma
            .subject({ id })
            .config()
            .$fragment(`
                fragment PostWithAuthorsAndComments on Post {
                    subject { name }
                    subSubjects {
                        subject { name }
                        themes
                    }
                    themes
                    exams {
                        trainings
                        sessions
                    }
                }`);
        return {
            name: config.subject.name,
            subSubjects: config.subSubjects.map((subject) => ({
                name: subject.subject.name,
                themes: subject.themes,
            })),
            themes: config.themes,
            exams: config.exams,
        };
    }
}
module.exports = SubjectConfigService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdWJqZWN0Q29uZmlnL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRztBQUtILDRCQUE0QjtBQUM1Qix3RUFBcUY7QUFHckYsTUFBTSxvQkFBb0I7SUFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFzQjtRQUMvQixNQUFNLGFBQWEsR0FBRyxNQUFNLHNCQUFNLENBQUMsbUJBQW1CLENBQUM7WUFDbkQsT0FBTyxFQUFFO2dCQUNMLE9BQU8sRUFBRTtvQkFDTCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7aUJBQ3BCO2FBQ0o7WUFDRCxNQUFNLEVBQUU7Z0JBQ0osR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRTthQUMzQjtZQUNELEtBQUssRUFBRTtnQkFDSCxNQUFNLEVBQUU7b0JBQ0osUUFBUSxFQUFFO3dCQUNOLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDakQ7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDbEQ7aUJBQ0o7YUFDSjtZQUNELFdBQVcsRUFBRTtnQkFDVCxNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzFELE9BQU87d0JBQ0gsT0FBTyxFQUFFOzRCQUNMLE9BQU8sRUFBRTtnQ0FDTCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7NkJBQ3JCO3lCQUNKO3FCQUNKLENBQUM7Z0JBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDakI7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVO1FBQ25CLE1BQU0sTUFBTSxHQUFHLE1BQU0sc0JBQU07YUFDdEIsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7YUFDZixNQUFNLEVBQUU7YUFDUixTQUFTLENBQUM7Ozs7Ozs7Ozs7OztrQkFZTCxDQUFRLENBQUM7UUFFbkIsT0FBTztZQUNILElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUk7WUFDekIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUMxQixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07YUFDekIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztTQUN0QixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsaUJBQVMsb0JBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnk6IE9sZWtzYW5kciBCZXpydWtvdlxuICogQ3JlYXRpb24gZGF0ZTogMTEgTWFyY2ggMjAyMFxuICovXG5cbi8qKiBFeHRlcm5hbCBpbXBvcnRzICovXG5pbXBvcnQgeyBGYXN0aWZ5SW5zdGFuY2UsIEZhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3QgfSBmcm9tICdmYXN0aWZ5JztcblxuLyoqIEFwcGxpY2F0aW9uJ3MgaW1wb3J0cyAqL1xuaW1wb3J0IHsgcHJpc21hLCBTdWJTdWJqZWN0Q3JlYXRlSW5wdXQgfSBmcm9tICcuLi8uLi9wcmlzbWEvZ2VuZXJhdGVkL3ByaXNtYS1jbGllbnQnO1xuaW1wb3J0IHsgVFN1YmplY3RDb25maWcgfSBmcm9tICcuL3R5cGVzJztcblxuY2xhc3MgU3ViamVjdENvbmZpZ1NlcnZpY2Uge1xuICAgIGFzeW5jIGNyZWF0ZShjb25maWc6IFRTdWJqZWN0Q29uZmlnKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3RDb25maWcgPSBhd2FpdCBwcmlzbWEuY3JlYXRlU3ViamVjdENvbmZpZyh7XG4gICAgICAgICAgICBzdWJqZWN0OiB7XG4gICAgICAgICAgICAgICAgY29ubmVjdDoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoZW1lczoge1xuICAgICAgICAgICAgICAgIHNldDogY29uZmlnLnRoZW1lcyB8fCBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGFtczoge1xuICAgICAgICAgICAgICAgIGNyZWF0ZToge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiBjb25maWcuZXhhbXMgPyBjb25maWcuZXhhbXMuc2Vzc2lvbnMgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdHJhaW5pbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQ6IGNvbmZpZy5leGFtcyA/IGNvbmZpZy5leGFtcy50cmFpbmluZ3MgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1YlN1YmplY3RzOiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlOiBjb25maWcuc3ViU3ViamVjdHMgPyBjb25maWcuc3ViU3ViamVjdHMubWFwKHN1YmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3ViamVjdC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1YmplY3RDb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnKGlkOiBzdHJpbmcpOiBQcm9taXNlPFRTdWJqZWN0Q29uZmlnPiB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHByaXNtYVxuICAgICAgICAgICAgLnN1YmplY3QoeyBpZCB9KVxuICAgICAgICAgICAgLmNvbmZpZygpXG4gICAgICAgICAgICAuJGZyYWdtZW50KGBcbiAgICAgICAgICAgICAgICBmcmFnbWVudCBQb3N0V2l0aEF1dGhvcnNBbmRDb21tZW50cyBvbiBQb3N0IHtcbiAgICAgICAgICAgICAgICAgICAgc3ViamVjdCB7IG5hbWUgfVxuICAgICAgICAgICAgICAgICAgICBzdWJTdWJqZWN0cyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0IHsgbmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVtZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGVtZXNcbiAgICAgICAgICAgICAgICAgICAgZXhhbXMge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhaW5pbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWApIGFzIGFueTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogY29uZmlnLnN1YmplY3QubmFtZSxcbiAgICAgICAgICAgIHN1YlN1YmplY3RzOiBjb25maWcuc3ViU3ViamVjdHMubWFwKChzdWJqZWN0OiBhbnkpID0+ICh7XG4gICAgICAgICAgICAgICAgbmFtZTogc3ViamVjdC5zdWJqZWN0Lm5hbWUsXG4gICAgICAgICAgICAgICAgdGhlbWVzOiBzdWJqZWN0LnRoZW1lcyxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRoZW1lczogY29uZmlnLnRoZW1lcyxcbiAgICAgICAgICAgIGV4YW1zOiBjb25maWcuZXhhbXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgPSBTdWJqZWN0Q29uZmlnU2VydmljZTtcbiJdfQ==