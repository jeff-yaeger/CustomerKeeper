USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_SelectbyuseridPast]    Script Date: 4/4/2018 5:13:05 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






create proc [dbo].[Appointment_SelectbyuseridPast]
	@UserId  nvarchar(450)
as
/*
	declare
		@_userId nvarchar(450) = a1be02bb-3943-4c31-b21d-d002ea0642ce
	exec Appointment_SelectbyuseridPast @_userId;
*/

begin try
BEGIN TRANSACTION
	declare @currDate DATETIME = SYSDATETIMEOFFSET();

	select
		Id,
		UserId,
		CustFName,
		CustLName,
		Street,
		City,
		State,
		Zip,
		Email,
		Phone,
		Appoint,
		CreatedDate,
		ModifiedDate,
		ModifiedBy,
		IsCnfrmed,
		ReminderSent,
		CompName,
		CompEmail

	from
		Appointment
	where
		UserId=@userId and @currDate > Appoint
	order by 
		Appoint DESC
	commit
end try
begin catch
	IF @@TRANCOUNT > 0
		Rollback

	declare @ErrMsg nvarchar(4000), @ErrSeverity int
	select @ErrMsg = ERROR_MESSAGE(),
			@ErrSeverity = ERROR_SEVERITY()

	RAISERROR(@ErrMsg, @ErrSeverity, 1)
end catch
GO


