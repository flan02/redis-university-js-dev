const getMeasurementsForDate = async (siteId, metricUnit, timestamp, limit) => {
  const client = redis.getClient();

  // e.g. metrics:whGenerated:2020-01-01:1
  const key = keyGenerator.getDayMetricKey(siteId, metricUnit, timestamp);

  // Array of strings formatted <measurement value>:<minute of day>
  const metrics = await client.zrevrangeAsync(key, 0, limit - 1);

  // elements | 10.0:0 | 10.5:1 | 11.0:2 | ... | 15.0:1439 |
  // score    |   0    |   1    |   2    | ... | 1439  |

  // zrevrange gets elements in descending order of score (minute of day)
  // (15.0:1439, 1439) ; ... ; (11.0:2, 2); (10.5:1, 1); (10.0:0, 0)
  // zrange gets elements in ascending order of score (minute of day)
  // (10.0:0, 0); (10.5:1, 1); (11.0:2, 2); ... ; (15.0:1439, 1439)

  const formattedMeasurements = [];

  for (let n = 0; n < metrics.length; n += 1) {
    const { value, minute } = extractMeasurementMinute(metrics[n]);

    // Create a measurement object
    const measurement = {
      siteId,
      dateTime: timeUtils.getTimestampForMinuteOfDay(timestamp, minute),
      value,
      metricUnit,
    };

    // Add in reverse order.
    formattedMeasurements.unshift(measurement);
  }

  return formattedMeasurements;
};

// QUIZ
/* 
At the first minute of the day, the temperature is 18.0 degrees Celsius. We store this in our sorted set as "18.0:1". Why do we have to append ":1" to the measurement?

false: To allow for range queries by minute
false: To allow the minute value to be retrieved
true: To ensure that all members of the sorted set will be unique
false: To ensure correct ordering of the sorted set
*/
