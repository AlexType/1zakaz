export function getPublicAssetPath(
  path: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH,
) {
  const normalizedBasePath = basePath?.replace(/\/+$/, "") ?? "";
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;

  return `${normalizedBasePath}${normalizedPath}`;
}
