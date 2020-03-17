"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 March 2020
 *
 * Service which handles subjects and things related to subject such as create, fetch etc.
 */
/** External imports */
/** Application's imports */
const prisma_client_1 = require("../../prisma/generated/prisma-client");
class SubjectService {
    async create(name) {
        const subject = await prisma_client_1.prisma.createSubject({ name });
        return subject;
    }
    async subjects() {
        const subjects = await prisma_client_1.prisma.subjects({
            where: {
                isSubSubject: false,
            },
        }).$fragment(`fragment SelectName on Subject { id name image }`);
        return subjects.map(subject => ({
            ...subject,
            image: subject.image !== null
                ? `http://localhost:4000/public/subjects-images/${subject.image}`
                : null,
        }));
    }
}
module.exports = SubjectService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdWJqZWN0L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHO0FBRUgsdUJBQXVCO0FBRXZCLDRCQUE0QjtBQUM1Qix3RUFBdUU7QUFHdkUsTUFBTSxjQUFjO0lBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUNyQixNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVyRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVE7UUFJVixNQUFNLFFBQVEsR0FBVSxNQUFNLHNCQUFNLENBQUMsUUFBUSxDQUFDO1lBQzFDLEtBQUssRUFBRTtnQkFDSCxZQUFZLEVBQUUsS0FBSzthQUN0QjtTQUNKLENBQUMsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUVqRSxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLEdBQUcsT0FBTztZQUNWLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUk7Z0JBQ3pCLENBQUMsQ0FBQyxnREFBZ0QsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDakUsQ0FBQyxDQUFDLElBQUk7U0FDYixDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7Q0FDSjtBQUVELGlCQUFTLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieTogT2xla3NhbmRyIEJlenJ1a292XG4gKiBDcmVhdGlvbiBkYXRlOiA5IE1hcmNoIDIwMjBcbiAqXG4gKiBTZXJ2aWNlIHdoaWNoIGhhbmRsZXMgc3ViamVjdHMgYW5kIHRoaW5ncyByZWxhdGVkIHRvIHN1YmplY3Qgc3VjaCBhcyBjcmVhdGUsIGZldGNoIGV0Yy5cbiAqL1xuXG4vKiogRXh0ZXJuYWwgaW1wb3J0cyAqL1xuXG4vKiogQXBwbGljYXRpb24ncyBpbXBvcnRzICovXG5pbXBvcnQgeyBwcmlzbWEsIFN1YmplY3QgfSBmcm9tICcuLi8uLi9wcmlzbWEvZ2VuZXJhdGVkL3ByaXNtYS1jbGllbnQnO1xuaW1wb3J0IHsgSVN1YmplY3RTZXJ2aWNlIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNsYXNzIFN1YmplY3RTZXJ2aWNlIGltcGxlbWVudHMgSVN1YmplY3RTZXJ2aWNlIHtcbiAgICBhc3luYyBjcmVhdGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxTdWJqZWN0PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCBwcmlzbWEuY3JlYXRlU3ViamVjdCh7IG5hbWUgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfVxuXG4gICAgYXN5bmMgc3ViamVjdHMoKTogUHJvbWlzZTx7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICB9W10+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdHM6IGFueVtdID0gYXdhaXQgcHJpc21hLnN1YmplY3RzKHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgaXNTdWJTdWJqZWN0OiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLiRmcmFnbWVudChgZnJhZ21lbnQgU2VsZWN0TmFtZSBvbiBTdWJqZWN0IHsgaWQgbmFtZSBpbWFnZSB9YCk7XG5cbiAgICAgICAgcmV0dXJuIHN1YmplY3RzLm1hcChzdWJqZWN0ID0+ICh7XG4gICAgICAgICAgICAuLi5zdWJqZWN0LFxuICAgICAgICAgICAgaW1hZ2U6IHN1YmplY3QuaW1hZ2UgIT09IG51bGxcbiAgICAgICAgICAgICAgICA/IGBodHRwOi8vbG9jYWxob3N0OjQwMDAvcHVibGljL3N1YmplY3RzLWltYWdlcy8ke3N1YmplY3QuaW1hZ2V9YFxuICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cblxuZXhwb3J0ID0gU3ViamVjdFNlcnZpY2U7XG4iXX0=