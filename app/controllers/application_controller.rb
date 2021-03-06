class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  add_flash_types :info, :error, :success, :warning

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response
  rescue_from StandardError, with: :render_internal_error

  # TODO: (andy.vaughn@appfolio.com, 20210303): grab tags from request and include in erb template
  def home; end

  # noinspection RubyInstanceMethodNamingConvention
  def render_unprocessable_entity_response(exception)
    render json: exception.record.errors, status: :unprocessable_entity
  end

  def render_not_found_response(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def render_internal_error(exception)
    render json: { error: exception.message }, status: :internal_server_error
  end
end
