Feature: Using gulp-rev-append replace rev=@@@ to rev=hash_of_file in css file
  As a user of gulp-rev-append
  I want to append a revision hash to css dependencies declared in an css file with url()
  So that non-cached versions of the files are loaded

  Scenario: Hash is appended to file dependency defined with css url()
    Given I have declared css file content with rev=@@@ declared for each url()
    When I invoke the gulp-rev-append plugin
    Then The depencies are appended with a hash inline