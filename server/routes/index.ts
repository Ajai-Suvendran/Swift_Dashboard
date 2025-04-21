import { IRouter } from '../../../../src/core/server';
import { schema } from '@osd/config-schema';
import OpenSearchService from '../src/services/opensearchService';

export function defineRoutes(router: IRouter) {
  // Get all messages
  router.get(
    {
      path: '/api/swift-dashboard/messages',
      validate: {
        query: schema.object({
          fromDate: schema.maybe(schema.string()),
          toDate: schema.maybe(schema.string()),
          direction: schema.maybe(schema.string()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const { fromDate, toDate, direction } = request.query;
        const openSearchService = new OpenSearchService();
        
        let messages;
        if (fromDate || toDate) {
          messages = await openSearchService.getMessagesInDateRange(fromDate, toDate, direction);
        } else {
          messages = await openSearchService.getAllMessages(direction);
        }
        
        return response.ok({
          body: {
            messages,
            count: messages.length,
          },
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        return response.customError({
          statusCode: 500,
          body: {
            message: `Failed to fetch messages: ${error.message}`,
          },
        });
      }
    }
  );

  // Get message by ID
  router.get(
    {
      path: '/api/swift-dashboard/message/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const { id } = request.params;
        const openSearchService = new OpenSearchService();
        const message = await openSearchService.getMessageById(id);
        
        if (!message) {
          return response.notFound({
            body: {
              message: `Message with id ${id} not found`,
            },
          });
        }
        
        return response.ok({
          body: message,
        });
      } catch (error) {
        console.error(`Error fetching message with ID ${request.params.id}:`, error);
        return response.customError({
          statusCode: 500,
          body: {
            message: `Failed to fetch message: ${error.message}`,
          },
        });
      }
    }
  );

  // Define additional routes for your API...
}