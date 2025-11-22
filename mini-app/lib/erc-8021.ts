export type ERC8021Suffix = {
  ercSuffix: string; // 16 bytes hex string
  schemaId: number;
  schemaData: string; // hex string of variable length
};

export const ERC_SUFFIX = "80218021802180218021802180218021";

/**
 * Build an ERC‑8021 suffix for a transaction.
 *
 * @param schemaId - The schema ID (currently 0 or 1).
 * @param codes - Array of attribution codes (ASCII strings).
 * @param codeRegistryChainId - Optional chain ID for a custom registry (schema 1).
 * @param codeRegistryAddress - Optional address for a custom registry (schema 1).
 * @returns Hex string of the full suffix (without the 0x prefix).
 */
export function buildSuffix(
  schemaId: number,
  codes: string[],
  codeRegistryChainId?: number,
  codeRegistryAddress?: string
): string {
  // Encode codes as comma‑delimited ASCII
  const codesHex = Buffer.from(codes.join(","), "ascii").toString("hex");
  const codesLengthHex = Buffer.from([codesHex.length / 2]).toString("hex");

  let suffix = "";

  // Schema data
  suffix += codesLengthHex + codesHex;

  if (schemaId === 1) {
    if (!codeRegistryChainId || !codeRegistryAddress) {
      throw new Error("schemaId 1 requires codeRegistryChainId and codeRegistryAddress");
    }
    const chainIdHex = Buffer.from([codeRegistryChainId]).toString("hex");
    const chainIdLengthHex = Buffer.from([chainIdHex.length / 2]).toString("hex");
    const addressHex = codeRegistryAddress.replace(/^0x/, "");
    suffix += chainIdLengthHex + chainIdHex + addressHex;
  }

  // Append schemaId
  suffix += Buffer.from([schemaId]).toString("hex");

  // Append ERC suffix
  suffix += ERC_SUFFIX;

  return suffix;
}

/**
 * Parse an ERC‑8021 suffix from calldata.
 *
 * @param calldataHex - Hex string of the full calldata (without 0x).
 * @returns Parsed suffix object or null if not valid.
 */
export function parseSuffix(calldataHex: string): ERC8021Suffix | null {
  const suffixHex = calldataHex.slice(-ERC_SUFFIX.length);
  if (suffixHex !== ERC_SUFFIX) return null;

  const remaining = calldataHex.slice(0, -ERC_SUFFIX.length);
  const schemaIdHex = remaining.slice(-2);
  const schemaId = parseInt(schemaIdHex, 16);
  const data = remaining.slice(0, -2);

  if (schemaId === 0) {
    const codesLengthHex = data.slice(-2);
    const codesLength = parseInt(codesLengthHex, 16);
    const codesHex = data.slice(-2 * codesLength, -2);
    const codes = Buffer.from(codesHex, "hex").toString("ascii").split(",");
    return { ercSuffix: ERC_SUFFIX, schemaId, schemaData: codesHex };
  }

  if (schemaId === 1) {
    // Simplified parsing for schema 1 (not fully implemented)
    return { ercSuffix: ERC_SUFFIX, schemaId, schemaData: data };
  }

  return null;
}
