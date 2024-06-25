/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Stream } from '../models/Stream';
import type { StreamCollaborator } from '../models/StreamCollaborator';
import type { StreamCreate } from '../models/StreamCreate';
import type { Streamer } from '../models/Streamer';
import type { StreamerCreate } from '../models/StreamerCreate';
import type { StreamerUpdate } from '../models/StreamerUpdate';
import type { Viewer } from '../models/Viewer';
import type { ViewerCreate } from '../models/ViewerCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Create a new streamer (signup)
     * @param requestBody
     * @returns Streamer Streamer created successfully
     * @throws ApiError
     */
    public static postStreamers(
        requestBody: StreamerCreate,
    ): CancelablePromise<Streamer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streamers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * Get streamers list
     * @returns Streamer A list of streamers
     * @throws ApiError
     */
    public static getStreamers(): CancelablePromise<Array<Streamer>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streamers',
        });
    }
    /**
     * Update streamer details
     * @param streamerId ID of the streamer to update
     * @param requestBody
     * @returns Streamer Streamer updated successfully
     * @throws ApiError
     */
    public static putStreamers(
        streamerId: string,
        requestBody: StreamerUpdate,
    ): CancelablePromise<Streamer> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/streamers/{streamerId}',
            path: {
                'streamerId': streamerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Streamer not found`,
            },
        });
    }
    /**
     * Create a new stream
     * @param requestBody
     * @returns Stream Stream created successfully
     * @throws ApiError
     */
    public static postStreams(
        requestBody: StreamCreate,
    ): CancelablePromise<Stream> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/streams',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * Get all streams
     * @returns Stream A list of all streams
     * @throws ApiError
     */
    public static getStreams(): CancelablePromise<Array<Stream>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams',
        });
    }
    /**
     * Get stream details
     * @param streamId ID of the stream to delete
     * @returns Stream Details of the requested stream
     * @throws ApiError
     */
    public static getStreams1(
        streamId: string,
    ): CancelablePromise<Stream> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/streams/{streamId}',
            path: {
                'streamId': streamId,
            },
            errors: {
                404: `Stream not found`,
            },
        });
    }
    /**
     * Delete a stream
     * @param streamId ID of the stream to delete
     * @returns void
     * @throws ApiError
     */
    public static deleteStreams(
        streamId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/streams/{streamId}',
            path: {
                'streamId': streamId,
            },
            errors: {
                404: `Stream not found`,
            },
        });
    }
    /**
     * Add a collaborator to a stream
     * @param streamId ID of the stream to manage collaborators
     * @param requestBody
     * @returns any Collaborator added successfully
     * @throws ApiError
     */
    public static putStreamsCollaborators(
        streamId: string,
        requestBody: StreamCollaborator,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/streams/{streamId}/collaborators',
            path: {
                'streamId': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Stream not found`,
            },
        });
    }
    /**
     * Remove a collaborator from a stream
     * @param streamId ID of the stream to manage collaborators
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static deleteStreamsCollaborators(
        streamId: string,
        requestBody: StreamCollaborator,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/streams/{streamId}/collaborators',
            path: {
                'streamId': streamId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Stream or collaborator not found`,
            },
        });
    }
    /**
     * Create a new viewer
     * @param requestBody
     * @returns Viewer Viewer created successfully
     * @throws ApiError
     */
    public static postViewers(
        requestBody: ViewerCreate,
    ): CancelablePromise<Viewer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/viewers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * Get viewer details
     * @param viewerId ID of the viewer to retrieve
     * @returns Viewer Details of the requested viewer
     * @throws ApiError
     */
    public static getViewers(
        viewerId: string,
    ): CancelablePromise<Viewer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/viewers/{viewerId}',
            path: {
                'viewerId': viewerId,
            },
            errors: {
                404: `Viewer not found`,
            },
        });
    }
}
