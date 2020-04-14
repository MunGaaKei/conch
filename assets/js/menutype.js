var menu = {
    'untitled': {
        title: '未命名',
        path: undefined,
        editor: 0,
        type: 2,
        create: '2020-01-01'
    },
    'norwegian': {
        title: '森林',
        path: 'D:/1AN/conch/documents/挪威的森林/',
        files: ['chapter1'],
        type: 1
    },
    'chapter1': {
        title: '第一章',
        path: 'D:/1AN/conch/documents/挪威的森林/第一章/',
        files: ['section1', 'section2'],
        parent: 'norwegian',
        type: 1
    },
    'section1': {
        title: '第一节',
        path: 'D:/1AN/conch/documents/挪威的森林/第一章/第一节.txt',
        editor: 0,
        time: '2020-01-03',
        parent: 'chapter1',
        type: 2
    },
    'section2': {
        title: '第二节',
        path: 'D:/1AN/conch/documents/挪威的森林/第一章/第一节.txt',
        editor: 0,
        time: '2020-01-03',
        parent: 'chapter1',
        type: 2
    }
}