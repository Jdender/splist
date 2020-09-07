import { schema } from 'nexus';

schema.queryType({
    definition(t) {
        t.field('hello', {
            type: 'String',
            async resolve() {
                return 'world!';
            },
        });
    },
});
