require 'test_helper'
class ApplicationControllerTest < ActionDispatch::IntegrationTest
  test 'should get home' do
    get root_url
    assert_select 'p', 'Hello AppFolio!'
    assert_response :success
  end
end
