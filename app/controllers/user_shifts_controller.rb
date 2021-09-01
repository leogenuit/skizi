class UserShiftsController < ApplicationController
  before_action :set_user_shift, only: [:update]

  def update

    user_shift_start = params[:start]
    user_shift_end = params[:end]

    @shift = Shift.find_by(started_at: user_shift_start, ended_at: user_shift_end)

    return head 404 if @shift.nil?

    @user_shift.update!(shift: @shift)
  end

  private

  def set_user_shift
    @user_shift = UserShift.find(params[:id])
  end
end
