### Api Scheme

Describe all endpoints existing in Api class.

Api response for **/subjects/configuration/{subject-name}**
when subject can be divided for subjects, for example:
Math can be divided to Algebra and Geomtery.
```javascript
data: {
    subject: {
        name: 'Math',
        subSubjects: [
            {
                name: 'Geometry',
                themes: ['Theme 1', 'Theme 2']
            },
            {
                name: 'Algebra',
                themes: ['Theme 1', 'Theme 2']
            }
        ],
        exams: {
            trainings: ['Variant 1', 'Variant 2'],
            sessions: ['2017', '2018']
        }
    }
}
```

Api response for **/subjects/configuration/{subject-name}**
when subject doesn't have sub subjects.
```javascript
data: {
    subject: {
        name: 'Math',
        theme: ['Theme 1', 'Theme 2'],
        exams: {
            trainings: ['Variant 1', 'Variant 2'],
            sessions: ['2017', '2018']
        }
    }
}
```