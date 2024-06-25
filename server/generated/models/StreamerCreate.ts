/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Stream } from './Stream';
export type StreamerCreate = {
    personalInfo?: {
        /**
         * Name of the streamer
         */
        name?: string;
        /**
         * Email address of the streamer
         */
        email?: string;
    };
    /**
     * List of streams associated with the streamer
     */
    streams?: Array<Stream>;
};

