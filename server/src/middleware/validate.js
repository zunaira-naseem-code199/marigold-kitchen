// Zod validation helpers. Usage: router.post('/', validate(schema), handler)

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || 'form';
        if (!errors[key]) errors[key] = issue.message;
      }
      return res.status(400).json({ message: 'Please check the highlighted fields', errors });
    }
    // Express 4 lets us overwrite body; for query keep parsed copy separately.
    if (source === 'body') req.body = result.data;
    else req.validated = { ...(req.validated || {}), [source]: result.data };
    return next();
  };
}
