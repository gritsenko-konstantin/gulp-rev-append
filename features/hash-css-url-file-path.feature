Feature: Use gulp-rev-append to modify css url() dependency declaration in css file
  As a user of gulp-rev-append
  I want to append a revision hash to css dependencies declared in an css file with url()
  So that non-cached versions of the files are loaded

  Scenario: Regular expression should match all possible css combinations
    Given I have declared all possible combinations
    When I invoke the regexp match
    Then We have matched all combinations

  Scenario: Hash is appended to file dependency defined with css url()
    Given I have declared dependencies in an css file using css url() with revision tokens
    When I invoke the gulp-rev-append plugin
    Then The depencies are appended with a hash inline