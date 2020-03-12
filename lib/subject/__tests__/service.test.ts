import SubjectService from '../service';

test('', async () => {
    const subjectService = new SubjectService();

    const subjects = await subjectService.subjects();

    console.log(subjects);
});
