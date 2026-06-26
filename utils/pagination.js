const getPagination = (query = {}) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100; // hard cap so a client can't request 1M rows

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Build the pagination block for the response
const buildPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0,
});

export { getPagination, buildPagination };
