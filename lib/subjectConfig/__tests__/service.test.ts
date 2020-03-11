import SubjectConfigService from '../service';
import { prisma } from '../../../prisma/generated/prisma-client';

test('', async () => {
    const subjectConfigService = new SubjectConfigService();

    // const config = await subjectConfigService.create({
    //     name: 'Математика',
    //     subSubjects: [{
    //         name: 'Геометрія',
    //     }],
    //     exams: {
    //         sessions: ['1', '2', '3'],
    //         trainings: ['4', '5', '6'],
    //     },
    // });

    console.log(await prisma.subjectConfig({
        id: '5e6913c824aa9a00072762fc',
    }));
});
