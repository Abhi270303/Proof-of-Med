export function padHash(hash) {
  // Remove "0x" prefix if it exists
  const cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;

  let newHash = "0x";
  for (let i = 0; i < 64 - cleanHash.length; i++) {
    newHash += "0";
  }
  return newHash + cleanHash;
}
