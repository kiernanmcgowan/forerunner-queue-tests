// queue-test
// tests for forerunner queue modules

var vows = require('vows');
var async = require('async');
var assert = require('assert');

var sampleData = createTestData(10);

// take in a queue object just like forerunner would
// this way the queue object can be initialized properly w/o the tests being concerned
function testModule(queueObject, testCallbacks) {
  var tests = vows.describe('Queue')
  .addBatch({
    'Emptying the queue': {
      topic: function() {
        queueObject.empty(this.callback);
      },

      'does not error': function(err) {
        assert.isUndefined(err);
      }
    }
  })
  .addBatch({
    'Pushing jobs': {
      topic: function() {
        async.each(sampleData, function(job, cb) {
          queueObject.push(job.id, job.type, job.data, cb);
        }, this.callback);
      },

      'works': function(err) {
        assert.isUndefined(err);
      },

      'and when iterated over': {
        topic: function() {
          var self = this;
          var pulledData = [];
          queueObject.each(10, function(id, type, data) {
            pulledData.push({
              id: id,
              type: type,
              data: data
            });
          }, function(err) {
            self.callback(err, pulledData);
          });
        },

        'all pushed jobs are present': function(err, pulledData) {
          assert.isNull(err);
          assert.equal(pulledData.length, 10);
        },

        'job data is peserved': function(err, pulledData) {
          // since the queue does not have to be FIFO do a n^2 search :/
          for (var i = 0; i < pulledData.length; i++) {
            var pulledDataFoundInSampleData = false;
            for (var j = 0; j < sampleData.length; j++) {
              if (sampleData[j].id === pulledData[i].id) {
                assert.deepEqual(sampleData[j], pulledData[i]);
                pulledDataFoundInSampleData = true;
                break;
              }
            }
            assert.isTrue(pulledDataFoundInSampleData);
          }
        },

        'trying to iterate an empty queue': {
          'topic' : function() {
            var self = this;
            var eachCalled = false;
            queueObject.each(10, function(id, type, data) {
              eachCalled = true;
            }, function(err) {
              self.callback(err, eachCalled);
            });
          },

          'does not error, but does not call the \'eachFunction\'': function(err, eachCalled) {
            assert.isNull(err);
            assert.isFalse(eachCalled);
          }
        }
      }
    }
  })
  .addBatch({
    'Pushing via a requeue': {
      topic: function() {
        var self = this;
        // empty the queue first
        queueObject.empty(function(err) {
          if (err) {
            self.callback(err);
          }
          async.each(sampleData, function(job, cb) {
            queueObject.requeue(job.id, job.type, job.data, cb);
          }, self.callback);
        });
      },

      'works': function(err) {
        assert.isUndefined(err);
      },

      'and when iterated over': {
        topic: function() {
          var self = this;
          var pulledData = [];
          queueObject.each(10, function(id, type, data) {
            pulledData.push({
              id: id,
              type: type,
              data: data
            });
          }, function(err) {
            self.callback(err, pulledData);
          });
        },

        'all pushed jobs are present': function(err, pulledData) {
          assert.isNull(err);
          assert.equal(pulledData.length, 10);
        },

        'job data is peserved': function(err, pulledData) {
          // since the queue does not have to be FIFO do a n^2 search :/
          for (var i = 0; i < pulledData.length; i++) {
            var pulledDataFoundInSampleData = false;
            for (var j = 0; j < sampleData.length; j++) {
              if (sampleData[j].id === pulledData[i].id) {
                assert.deepEqual(sampleData[j], pulledData[i]);
                pulledDataFoundInSampleData = true;
                break;
              }
            }
            assert.isTrue(pulledDataFoundInSampleData);
          }
        }
      }

    }
  })
  .run({reporter: require('vows/lib/vows/reporters/spec')}, testCallbacks);
}
module.exports = testModule;

// function to generate sample data for testing
function createTestData(count) {
  var idCounter = 0;
  var out = [];
  for (var i = 0; i < count; i++) {
    out.push({
      id: idCounter,
      type: 'test_job',
      data: {
        foo: 'bar',
        cat: 'dog'
      }
    });
    idCounter += 1;
  }
  return out;
}
