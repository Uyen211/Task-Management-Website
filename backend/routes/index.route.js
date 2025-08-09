import signRouter from './sign.route.js';
import taskRouter from './task.route.js';

export default function route(app) {
    app.use('/sign', signRouter);
    app.use('/task', taskRouter);
}
