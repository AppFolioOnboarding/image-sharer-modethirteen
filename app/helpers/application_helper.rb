module ApplicationHelper
  # Render flash messages as JSON data for React component
  # @param [Array<Hash>] messages - flash messages by type and message
  # @return [String]
  def flash_json(messages)
    messages.collect do |type, text|
      {
        id: text.object_id,
        type: type,
        text: text
      }
    end.to_json
  end
end
