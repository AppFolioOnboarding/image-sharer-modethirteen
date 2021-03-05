module ApplicationHelper
  # Map flash message type symbol to bootstrap stylesheet class
  # @param [String] level - flash type symbol cast to string
  # @return [String]
  def flash_class(level)
    bootstrap_alert_class = {
      'error' => 'alert-danger',
      'info' => 'alert-info',
      'success' => 'alert-success',
      'warning' => 'alert-warning'
    }
    bootstrap_alert_class[level]
  end
end
