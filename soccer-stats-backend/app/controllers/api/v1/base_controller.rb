# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ActionController::API
  
  private
  
  def render_success(data = nil, message = 'Success', status = :ok)
    render json: {
      success: true,
      message: message,
      data: data
    }, status: status
  end
  
  def render_error(message = 'Something went wrong', errors = nil, status = :unprocessable_entity)
    render json: {
      success: false,
      message: message,
      errors: errors
    }, status: status
  end
  
  def render_not_found(message = 'Resource not found')
    render json: {
      success: false,
      message: message
    }, status: :not_found
  end
end