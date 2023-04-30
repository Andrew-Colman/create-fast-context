import React from 'react';
import { createFastContext } from '../src/index';
import { render, screen } from './test-utils';
import { groups, projectIds } from './__fixtures__/groups';

function setup(arg: any) {
    const { Provider, useStore, useSetStore } = createFastContext();
    const returnVal = {};
    function TestComponent({ id }) {
        Object.assign(returnVal, useStore(arg), { 2: useSetStore() });
        return <div>{id}</div>;
    }

    function MatchingId() {
        const [project] = useStore<{ id: string }>(arg);
        return <div>{project?.id}</div>;
    }

    render(
        <>
            {groups.map(group => (
                <div key={group.id}>
                    {group.projects.map(project => (
                        <Provider key={project.id} project={project}>
                            {/* //will pick via prop */}
                            <TestComponent
                                id={project.id}
                            /> <MatchingId /> {/* //will pick via hook */}
                        </Provider>
                    ))}
                </div>
            ))}
        </>
    );
    return returnVal;
}

describe('createFastContext multiple siblings providers', () => {
    it('should Render component with unique state', () => {
        setup(state => state.project);

        projectIds.forEach(id => {
            const projectElements = screen.getAllByText(id);
            expect(projectElements).toHaveLength(2); // one for the TestComponent and one for the MatchingId component
        });
    });
});
