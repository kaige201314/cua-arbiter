from django.test import TestCase
from arbiter.common import utils
# Create your tests here.
class Test:
    def test_test():
        log_id = utils.generate_id()
        print(log_id)
