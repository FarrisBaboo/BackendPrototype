// Simple DTO mappers to keep outputs consistent

// For streams and filtered streams, ensure keys are ordered and explicit
const mapEntryDto = (entry) => {
  const { created_at, entry_id, was_interpolated, ...rest } = entry;
  return {
    created_at,
    entry_id,
    ...rest,
    ...(was_interpolated !== undefined ? { was_interpolated } : {})
  };
};

const mapEntriesDto = (entries) => entries.map(mapEntryDto);

module.exports = {
  mapEntryDto,
  mapEntriesDto
};


