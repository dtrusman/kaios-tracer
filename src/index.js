import { Tracer, BatchRecorder, Annotation } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http-custom';
import CLSContext from 'zipkin-context-cls';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import fetch from 'node-fetch';


class KaiosTracer {

    getMiddleware(tracer) {
        return expressMiddleware({ tracer });
    }

    configure(endpoint, localServiceName) {
        const ctxImpl = new CLSContext();

        const recorder = new BatchRecorder({
            logger: new HttpLogger({
                endpoint,
                fetch
            })
        });

        return new Tracer({ ctxImpl, recorder, localServiceName });
    }

    sendSpan(spanName, message, data = null) {
        const id = tracer.createRootId();
        tracer.setId(id);
        tracer.recordServiceName(spanName);
        tracer.recordMessage(message);
        data && Object.keys(data).forEach(k => tracer.recordBinary(k, data[k]))
        tracer.recordAnnotation(new Annotation.ClientRecv());
    }
}

module.exports = KaiosTracer;



// const data = {
//     error: 'my error',
//     errorCode: 2283
// }

// `http://zipkin:9411/api/v1/spans`