import axios from "axios";
import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface UnhcrpopstatInput {
  limit?: number;
  coo?: string;
  coa?: string;
  year?: number | number[] | string;  // Added string to handle input format
}

class UnhcrpopstatTool extends MCPTool<UnhcrpopstatInput> {
  name = "unhcrPopstat";
  description = "Fetch refugee population statistics from UNHCR API";

  schema = {
    limit: {
      type: z.number().optional(),
      description: "The numbers of items to return",
    },
    coo: {
      type: z.string().optional(),
      description: "Country of origin filter (3-letter ISO codes)",
    },
    coa: {
      type: z.string().optional(),
      description: "Country of asylum filter (3-letter ISO codes)",
    },
    year: {
      type: z.union([z.number(), z.array(z.number()), z.string()])  // Accept all possible input types
        .optional()
        .default(2024),  // Default to 2024 as a number
      description: "Year(s) to filter the data (e.g., 2024 or '2022,2023,2024')",
    },
  };

  async execute(input: UnhcrpopstatInput) {
    try {
      const params: Record<string, any> = {
        limit: input.limit,
        coo: input.coo,
        coa: input.coa,
        cf_type: "ISO",
      };

      // Handle year parameter
      let yearParam: string | number;
      if (input.year === undefined) {
        yearParam = 2024;  // Use default from schema
      } else if (typeof input.year === 'string') {
        // Parse string input
        const years = input.year.split(',').map(num => Number(num.trim()));
        yearParam = years.length === 1 ? years[0] : years.join(',');
      } else if (Array.isArray(input.year)) {
        yearParam = input.year.join(',');
      } else {
        yearParam = input.year;  // Single number case
      }
      
      params.year = yearParam;

      const response = await axios.get("https://api.unhcr.org/population/v1/population/", {
        params,
        headers: {
          Accept: "application/json",
        },
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: axios.isAxiosError(error) 
            ? `UNHCR API error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
}

export default UnhcrpopstatTool;