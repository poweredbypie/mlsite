import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    records: mongoose.Types.DocumentArray<{
        name?: string | undefined;
        link?: string | undefined;
        hertz?: number | undefined;
    }>;
    name?: string | undefined;
    creators?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, "type", {
    records: mongoose.Types.DocumentArray<{
        name?: string | undefined;
        link?: string | undefined;
        hertz?: number | undefined;
    }>;
    name?: string | undefined;
    creators?: string | undefined;
}>>;
export default _default;
