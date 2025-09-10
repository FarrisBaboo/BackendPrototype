const {
  getStreams: repoGetStreams,
  getStreamNames: repoGetStreamNames,
  getFilteredStreams
} = require('../repositories/pgRepository');

async function getStreams(req, res) {
  try {
    const limit = Number(req.query.limit) || 8000;
    const offset = Number(req.query.offset) || 0;
    const since = req.query.since || undefined;
    const data = await repoGetStreams({ limit, offset, since });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load streams' });
  }
}

async function getStreamNames(_req, res) {
  try {
    const names = await repoGetStreamNames();
    res.json(names);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load stream names' });
  }
}

async function postFilterStreams(req, res) {
  try {
    const { streamNames } = req.body || {};
    const data = await getFilteredStreams(streamNames);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to filter streams' });
  }
}

module.exports = { getStreams, getStreamNames, postFilterStreams };
