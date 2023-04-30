export const groups = [
    {
        id: 'Z7O42_-5js423eQs79rYl9wkcH',
        name: 'Group 1',
        projects: [
            {
                id: 'clgub634p9vx0000vfq4oa7546mkhel',
                name: 'Project 1',
            },
            {
                id: 'clgueo31l0000vfr75wlq4yr22e',
                name: 'Project 2',
            },
            {
                id: 'clgufi65ac8000evfrwvn0qkdjl',
                name: 'Project 3',
            },
        ],
    },
    {
        id: 'zpedM7qh04238VP31SzukgxWDh',
        name: 'Group 2',
        projects: [
            {
                id: 'clguiwz8o000ov452frw974330fr',
                name: 'Project A',
            },
            {
                id: 'clgxac7jf520004vfg86fla8lqh',
                name: 'Project B',
            },
        ],
    },
];

export const projectIds = groups.flatMap(group =>
    group.projects.map(project => project.id)
);
