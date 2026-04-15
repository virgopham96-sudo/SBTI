import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight, Brain, Heart, Compass, Zap, Users, Globe, CheckCircle2, ArrowLeft, RefreshCcw } from 'lucide-react';
import { allQuestions } from './data/questions';
import { SBTIEngine, Question } from './lib/engine';

const models = [
  {
    title: 'Mô hình Bản thân',
    icon: <Brain className="w-6 h-6 text-blue-500" />,
    description: 'Cách bạn nhận thức và đánh giá bản thân trong các tình huống khác nhau.',
  },
  {
    title: 'Mô hình Cảm xúc',
    icon: <Heart className="w-6 h-6 text-red-500" />,
    description: 'Cách bạn xử lý, thể hiện và phản ứng với những cảm xúc của mình.',
  },
  {
    title: 'Mô hình Thái độ',
    icon: <Compass className="w-6 h-6 text-green-500" />,
    description: 'Góc nhìn và cách tiếp cận của bạn đối với cuộc sống và những thách thức.',
  },
  {
    title: 'Mô hình Hành động',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    description: 'Cách bạn đưa ra quyết định và thực hiện các hành động trong thực tế.',
  },
  {
    title: 'Mô hình Xã hội',
    icon: <Users className="w-6 h-6 text-purple-500" />,
    description: 'Cách bạn tương tác, giao tiếp và xây dựng các mối quan hệ với người khác.',
  },
];

const faqs = [
  {
    question: 'SBTI là gì?',
    answer: 'SBTI là một hệ thống đánh giá tính cách toàn diện, phân tích 15 khía cạnh khác nhau dựa trên 5 mô hình cốt lõi để đưa ra một bức tranh chi tiết về con người bạn.',
  },
  {
    question: 'SBTI khác với MBTI như thế nào?',
    answer: 'Trong khi MBTI tập trung vào 4 cặp nhị phân (tạo ra 16 kiểu), SBTI sử dụng một cách tiếp cận đa chiều với 15 khía cạnh, tạo ra 27 kiểu tính cách chi tiết và sắc thái hơn.',
  },
  {
    question: 'Làm thế nào để làm bài trắc nghiệm SBTI? Bắt đầu từ đâu?',
    answer: 'Bạn chỉ cần nhấp vào nút "Làm bài kiểm tra ngay" trên trang web. Bài kiểm tra bao gồm 32 câu hỏi và mất khoảng 10-15 phút để hoàn thành.',
  },
  {
    question: 'Có bao nhiêu kiểu tính cách SBTI?',
    answer: 'Hệ thống SBTI phân loại con người thành 27 kiểu tính cách độc đáo, ví dụ như "Người Xử Lý", "Người Bạn Mẫu Mực", "Người Cảnh Báo", v.v.',
  },
  {
    question: 'Kết quả SBTI có chính xác không?',
    answer: 'Kết quả dựa trên các mô hình tâm lý học hiện đại và được thiết kế để phản ánh chính xác các xu hướng tự nhiên của bạn, tuy nhiên nó phụ thuộc vào sự trung thực của bạn khi trả lời.',
  },
  {
    question: 'Bài trắc nghiệm SBTI có miễn phí không?',
    answer: 'Vâng, bài trắc nghiệm tính cách SBTI cốt lõi hoàn toàn miễn phí cho tất cả mọi người.',
  },
];

const dimensions = [
  { name: 'Trực giác', color: 'bg-teal-500' },
  { name: 'Lý trí', color: 'bg-cyan-500' },
  { name: 'Cảm xúc', color: 'bg-sky-500' },
  { name: 'Nguyên tắc', color: 'bg-violet-500' },
  { name: 'Linh hoạt', color: 'bg-purple-500' },
  { name: 'Tự tin', color: 'bg-fuchsia-500' },
  { name: 'Cẩn trọng', color: 'bg-pink-500' },
  { name: 'Độc lập', color: 'bg-rose-500' },
  { name: 'Hòa đồng', color: 'bg-orange-500' },
  { name: 'Sáng tạo', color: 'bg-amber-500' },
  { name: 'Truyền thống', color: 'bg-yellow-500' },
  { name: 'Phiêu lưu', color: 'bg-lime-500' }
];

const personalityTypes = [
  { id: 'ctrl', code: 'CTRL', name: 'Người Kiểm Soát', english: 'The Controller', desc: 'Bạn là hiện thân của sự trật tự trong một thế giới hỗn loạn. Đối với bạn, một ngày không có kế hoạch hay một bảng tính không được định dạng đúng lề là một "tội ác". Bạn thích cảm giác nắm giữ vận mệnh trong lòng bàn tay, từ việc quyết định tối nay cả nhóm ăn gì cho đến việc sắp xếp lại cả cuộc đời của người khác. Sự kiểm soát giúp bạn an tâm, nhưng hãy cẩn thận kẻo bạn sẽ vô tình trở thành "sếp tổng" ngay cả trong những cuộc vui chơi đơn thuần nhất.', quote: 'Thấy chưa? Tôi đã xử lý xong bạn rồi.', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: 'atm-er', code: 'ATM-ER', name: 'Cây Rút Tiền', english: 'The Resource Provider', desc: 'Bạn chính là "ngân hàng di động" và là chỗ dựa vững chắc cho bạn bè. Không chỉ là tiền bạc, bạn sẵn sàng "chi viện" cả thời gian, công sức và sự thấu cảm mà không tính toán quá nhiều. Tuy nhiên, cái mác "cây rút tiền" đôi khi khiến bạn mệt mỏi; bạn thường xuyên tự hỏi liệu mọi người yêu quý mình vì chính con người mình hay vì những "giao dịch" giá trị mà bạn mang lại cho họ.', quote: 'Trông tôi có thực sự giàu đến vậy không?', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'dior-s', code: 'DIOR-S', name: 'Hệ Sang Chảnh Chật Vật', english: 'The Underdog-Chic', desc: 'Tên của bạn là sự kết hợp giữa vẻ ngoài sang trọng và tâm hồn của một "kẻ yếu thế" đang nỗ lực (Diaosi). Bạn có thể đang vật lộn với áp lực cuộc sống, nhưng tuyệt đối không được phép trông thảm hại. Bạn sẵn sàng chi những khoản tiền cuối cùng cho một món đồ hiệu chỉ để cảm thấy mình vẫn thuộc về thế giới thượng lưu. Bạn là bậc thầy trong việc che giấu sự chật vật bằng những bộ cánh hào nhoáng và nụ cười tự tin "giả trân".', quote: 'Cứ chờ xem màn lội ngược dòng của tôi đi.', color: 'bg-zinc-50 text-zinc-700 border-zinc-200' },
  { id: 'boss', code: 'BOSS', name: 'Thủ Lĩnh Quyết Đoán', english: 'The Dominator', desc: 'Bạn sinh ra với chiếc vương miện vô hình trên đầu. Trong bất kỳ hội nhóm nào, bạn luôn là người cầm trịch và đưa ra quyết định cuối cùng. Bạn không thích sự lấp lửng và cực kỳ dị ứng với những kẻ làm việc thiếu hiệu quả. Dù đôi khi bị coi là độc đoán, nhưng không ai có thể phủ nhận rằng nếu không có sự thúc đẩy và uy quyền của bạn, mọi dự án hay kế hoạch vui chơi sẽ mãi nằm trên giấy tờ.', quote: 'Đưa vô lăng đây. Để tôi lái.', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'than-k', code: 'THAN-K', name: 'Hệ Cảm Ơn', english: 'The Gratitude Seeker', desc: 'Bạn là người lịch sự đến mức "vô tri". Câu cửa miệng của bạn luôn là "Cảm ơn", "Xin lỗi" và "Làm phiền bạn quá". Bạn luôn cố gắng duy trì một hình ảnh tích cực và tử tế trong mắt mọi người, đôi khi đến mức bỏ qua cảm xúc thật của chính mình. Sự tử tế của bạn là thật, nhưng nó cũng là một lớp giáp bảo vệ để bạn tránh khỏi những xung đột và sự phán xét từ xã hội ngoài kia.', quote: 'Cảm tạ trời đất.', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'oh-no', code: 'OH-NO', name: 'Hệ Lo Âu', english: 'The Catastrophizer', desc: 'Cuộc đời bạn là một chuỗi những kịch bản "giả tưởng" về những thảm họa sắp xảy ra. Chỉ cần một tin nhắn "Seen" không hồi đáp sau 5 phút, bạn đã kịp tưởng tượng ra 100 lý do đối phương ghét mình. Bạn luôn trong trạng thái đề phòng và chuẩn bị cho những kịch bản tệ nhất. Sự lo âu này giúp bạn ít khi bị bất ngờ trước biến cố, nhưng nó cũng khiến năng lượng tinh thần của bạn luôn ở mức "báo động đỏ".', quote: 'Ôi không. Tại sao tôi lại nhận được kết quả này?!', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'gogo', code: 'GOGO', name: 'Hệ Tiến Lên', english: 'The High-Octane', desc: 'Năng lượng của bạn giống như một chiếc xe đua không phanh. Bạn không thể ngồi yên và luôn cảm thấy tội lỗi nếu một ngày trôi qua mà không làm được việc gì "ra hồn". Bạn là người kéo cả nhóm đi chơi, người nộp bài sớm nhất và cũng là người dễ bị kiệt sức nhất do chạy quá công suất. Đối với bạn, đứng yên một chỗ đồng nghĩa với việc bị bỏ lại phía sau dòng chảy xã hội.', quote: 'Đi đi đi. Di chuyển thôi.', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'sexy', code: 'SEXY', name: 'Tâm Điểm Quyến Rũ', english: 'The Charismatic Center', desc: 'Bạn hiểu rõ sức hấp dẫn của mình và biết cách tận dụng nó một cách triệt để. Không nhất thiết phải là vẻ ngoài, mà chính là thần thái tỏa ra từ sự tự tin và cách nói chuyện duyên dáng khiến bạn luôn là tâm điểm của đám đông. Bạn yêu thích ánh đèn sân khấu và cảm giác được ngưỡng mộ. Tuy nhiên, đôi khi bạn quá mải mê chăm chút cho "hào quang" bên ngoài mà quên mất việc chăm sóc nội tâm sâu sắc.', quote: 'Bạn sinh ra để trở nên không thể cưỡng lại.', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'love-r', code: 'LOVE-R', name: 'Kẻ Si Tình', english: 'The Romantic Idealist', desc: 'Bạn sống vì tình yêu và những rung cảm mãnh liệt. Thế giới của bạn thường nhuộm màu hồng của sự lãng mạn và những giấc mơ về một "tri kỷ" hoàn hảo. Bạn dễ dàng rơi vào lưới tình và cũng dễ dàng tổn thương vì sự nhạy cảm quá mức của mình. Khi yêu, bạn trao đi tất cả, nhưng khi thất vọng, bạn giống như một chiếc bóng đèn bị cháy, cần rất nhiều thời gian để "thay mới" và hồi phục.', quote: 'Nơi đây có quá nhiều tình yêu đến mức thực tại dường như không đủ.', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'mum', code: 'MUM', name: 'Vibe Người Mẹ', english: 'The Caretaker', desc: 'Bạn là "phụ huynh" của cả nhóm bạn. Bạn luôn mang theo khăn giấy, sạc dự phòng và những lời khuyên (đôi khi là cằn nhằn) về việc ăn uống, ngủ nghỉ của mọi người xung quanh. Sự quan tâm của bạn đôi lúc khiến người khác thấy ngột ngạt, nhưng sâu thẳm trong lòng, ai cũng biết rằng nếu thiếu bạn, cuộc sống của họ sẽ trở thành một mớ hỗn độn không ai dọn dẹp.', quote: 'Có lẽ... tôi có thể gọi bạn là mẹ không...?', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { id: 'fake', code: 'FAKE', name: 'Hệ Thảo Mai', english: 'The Chameleon', desc: 'Bạn sở hữu hàng trăm chiếc mặt nạ xã hội khác nhau. Bạn có khả năng đọc vị người đối diện và biến hóa tính cách sao cho phù hợp với mong đợi của họ một cách tài tình. Bạn khéo léo, giỏi giao tiếp và hiếm khi để lộ sơ hở về cảm xúc thật. Tuy nhiên, đôi khi chính bạn cũng thấy hoang mang không biết đâu mới là khuôn mặt thực sự của mình đằng sau lớp vỏ bọc hoàn hảo đó.', quote: 'Chẳng còn ai là người thật nữa.', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  { id: 'ojbk', code: 'OJBK', name: 'Hệ Sao Cũng Được', english: 'The Indifferent', desc: '"Ok, sao cũng được" chính là triết lý sống tối thượng của bạn. Bạn cực kỳ lười tranh cãi và sẵn sàng đồng ý với bất kỳ ý kiến nào miễn là nó không làm phiền đến sự bình yên của bạn. Bạn không hẳn là người dễ tính, bạn chỉ là người đã đạt đến cảnh giới "thấu hiểu nhân sinh" và nhận ra rằng hầu hết mọi chuyện trên đời đều không đáng để tốn năng lượng giải quyết.', quote: 'Khi tôi nói "sao cũng được", ý tôi là vậy đó.', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { id: 'malo', code: 'MALO', name: 'Hệ Mần Lâu', english: 'The Worker Monkey', desc: 'Bạn tự ví mình như chú khỉ "Ma Lou" (吗喽) – biểu tượng của những người lao động vất vả nhưng vẫn giữ được sự tinh quái. Bạn chấp nhận số phận là một "chú ong thợ" bị vắt kiệt sức bởi deadline, nhưng bạn sẽ làm điều đó kèm theo những lời than vãn hài hước và những meme tự giễu. Bạn là người thực tế, bền bỉ và có khả năng sinh tồn cực cao trong mọi môi trường khắc nghiệt nhất.', quote: 'Cuộc đời là một chuyến đi săn quái vật và tôi chỉ là một chú khỉ nhỏ trong đó.', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'joker', code: 'JOKE-R', name: 'Hệ Hề Hước', english: 'The Masked Clown', desc: 'Bạn là người mang lại tiếng cười cho mọi người, nhưng thường dùng chính nỗi đau hoặc sự thất bại của mình làm chất liệu chính. Bạn sợ sự im lặng và những bầu không khí nghiêm túc quá mức. Phía sau những câu đùa hóm hỉnh thường là một tâm hồn nhạy cảm và những nỗi buồn được giấu kín. Bạn thà để người khác cười nhạo mình còn hơn là để họ thấy bạn đang rơi lệ.', quote: 'Hóa ra tất cả chúng ta đều là những chú hề.', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'woc', code: 'WOC', name: 'Hệ Kinh Ngạc', english: 'The Shocked Reactor', desc: 'Cuộc đời bạn là một chuỗi những sự ngạc nhiên không hồi kết. Câu cửa miệng "Wo Cao" (Woc) thể hiện sự sửng sốt trước mọi drama hay biến cố, dù là nhỏ nhất. Bạn có xu hướng cường điệu hóa mọi thứ và là "khán giả" nhiệt tình nhất của các câu chuyện phiếm trên mạng xã hội. Sự hiện diện của bạn làm cho mọi tình huống bình thường trở nên kịch tính và thú vị hơn bao giờ hết.', quote: 'Chà, sao tôi lại có kết quả này?', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'thin-k', code: 'THIN-K', name: 'Nhà Phân Tích', english: 'The Overthinker', desc: 'Bộ não của bạn là một siêu máy tính chạy liên tục 24/7. Bạn phân tích mọi cử chỉ, lời nói và tình huống theo hàng triệu hướng khác nhau. Logic là vũ khí của bạn, nhưng nó cũng là gông xiềng khiến bạn khó đưa ra quyết định cuối cùng. Bạn thường xuyên bị kẹt trong cái bẫy "phân tích để rồi tê liệt" và luôn lo lắng về những chuyện thậm chí còn chưa xảy ra.', quote: 'Phiên suy nghĩ sâu: 100 giây và vẫn đang tiếp tục.', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'shit', code: 'SHIT', name: 'Hệ Thực Tế Phũ Phàng', english: 'The Cynical Mess', desc: 'Bạn luôn cảm thấy mình là một "đống lộn xộn" và cuộc đời này cũng chẳng khá hơn là bao. Bạn hay than phiền, hay nhìn vào mặt tối của vấn đề và tự coi mình là nạn nhân của định mệnh. Tuy nhiên, chính sự hoài nghi này lại giúp bạn nhìn thấu được những sự thật phũ phàng mà người khác cố tình lờ đi. Bạn là kẻ bi quan nhưng lại vô cùng thực tế và tỉnh táo.', quote: 'Thế giới này là một đống rác khổng lồ.', color: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
  { id: 'zzzz', code: 'ZZZZ', name: 'Hệ Buồn Ngủ', english: 'The Low-Battery', desc: 'Năng lượng xã hội của bạn luôn ở mức 1% báo động. Bạn có thể ngủ ở bất cứ đâu và trong bất kỳ hoàn cảnh nào. Đối với bạn, thế giới lý tưởng là một chiếc giường êm ái và không có bất kỳ ai nhắn tin quấy rầy. Bạn không hề lười, bạn chỉ đang trong quá trình "sạc pin" – vấn đề là quá trình này dường như diễn ra vô tận và bạn hiếm khi nào đạt đến mức 100%.', quote: 'Tôi chưa chết. Tôi chỉ đang ngủ thôi.', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'poor', code: 'POOR', name: 'Hệ Nghèo Đẹp', english: 'The Frugal Soul', desc: 'Bạn luôn trong trạng thái "cháy túi" (dù thực tế tài khoản có thể vẫn còn số dư). Bạn có khả năng tính toán giá tiền của mọi thứ trong đầu nhanh hơn máy tính và luôn săn lùng những mã giảm giá cực hạn. Sự nhạy cảm về tài chính khiến bạn luôn lo âu về tương lai, nhưng nó cũng giúp bạn trở thành chuyên gia sinh tồn với mức chi tiêu tối thiểu mà vẫn "ổn".', quote: 'Tôi cháy túi, nhưng tôi đang tập trung.', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'monk', code: 'MONK', name: 'Hệ Đi Tu', english: 'The Detached', desc: 'Bạn đã đạt đến cảnh giới của sự buông bỏ hoàn toàn. Bạn không còn mặn mà với các cuộc tranh luận, những xu hướng mới hay sự hào nhoáng của vật chất. Bạn sống thanh tịnh, điềm đạm và mặc kệ sự đời xoay chuyển. Sự tĩnh lặng của bạn đôi khi khiến người khác thấy khó hiểu hoặc lo lắng, nhưng thực chất bạn chỉ đang tận hưởng sự bình yên tuyệt đối trong tâm hồn mình.', quote: 'Không có ham muốn trần tục ở đây.', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { id: 'imsb', code: 'IMSB', name: 'Hệ Tự Ngược', english: 'The Self-Biter', desc: '"IMSB" (Self-attacking) đại diện cho những người luôn tự trách móc bản thân. Bạn thường xuyên cảm thấy tội lỗi dù không làm gì sai, và luôn khắt khe với chính mình hơn bất kỳ ai khác. Bạn là người cầu toàn đến mức cực đoan đối với cái tôi nội tại, luôn tự dằn vặt về những lỗi lầm cũ và cảm thấy mình chưa bao giờ là đủ tốt trong thế giới này.', quote: 'Đợi đã. Thật sao? Tôi thực sự ngốc đến vậy à?', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'solo', code: 'SOLO', name: 'Hệ Độc Hành', english: 'The Lone Wolf', desc: 'Bạn là định nghĩa sống của sự độc lập. Bạn đi ăn một mình, đi xem phim một mình và tận hưởng sự tự do tuyệt đối đó mà không thấy cô đơn. Bạn không ghét con người, bạn chỉ thấy việc phải giải thích hay thỏa hiệp với người khác là quá mệt mỏi. Bạn là vương quốc của chính mình và không cần bất kỳ "đồng minh" nào để cảm thấy hạnh phúc.', quote: 'Tôi đang khóc đây. Sao tôi lại trở thành kẻ cô độc thế này?', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: 'fuck', code: 'FUCK', name: 'Hệ Nổi Loạn', english: 'The Rebel', desc: 'Bạn là một "ngòi nổ" sẵn sàng bùng phát bất cứ lúc nào trước những điều chướng tai gai mắt. Bạn căm ghét sự giả tạo, những quy tắc vô lý và sự bất công xã hội. Bạn nói thẳng, nói thật và không ngại va chạm trực diện. Sự nổi loạn của bạn thường bắt nguồn từ một trái tim nóng bỏng muốn bảo vệ lẽ phải, nhưng cách thể hiện gai góc đôi khi khiến bạn bị coi là kẻ khó gần.', quote: 'Cái quái gì thế này?', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'dead', code: 'DEAD', name: 'Hệ Cạn Kiệt', english: 'The Burned-Out', desc: 'Tâm hồn bạn đã hoàn toàn "héo úa" vì áp lực cơm áo gạo tiền. Bạn đi làm như một cái xác không hồn, trả lời tin nhắn theo bản năng "Đã nhận" và không còn cảm nhận được niềm vui từ những sở thích cũ. Bạn đang ở trạng thái buông xuôi và chỉ mong thế giới này dừng lại một chút để bạn có thể thở. Bạn cần một kỳ nghỉ dài... hoặc một cuộc đời mới thanh thản hơn.', quote: 'Tôi... còn sống không vậy?', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  { id: 'hhhh', code: 'HHHH', name: 'Hệ Hahaha', english: 'The Chronic Laugher', desc: 'Bạn dùng tiếng cười "Hahaha" làm lá chắn cho mọi tình huống khó xử. Khi bối rối: cười; khi buồn: cười; khi không biết nói gì: cũng cười. Tiếng cười của bạn đôi khi mang tính máy móc nhưng nó giúp không khí xung quanh không bị chùng xuống. Bạn là người dễ gần nhưng rất khó để người khác có thể chạm đến những cảm xúc thực sự ẩn sau tràng cười bất tận đó.', quote: 'Hahahahahahaha.', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'drunk', code: 'DRUNK', name: 'Hệ Mơ Màng', english: 'The Hazy Soul', desc: 'Bạn sống trong một trạng thái mơ hồ như đang say, dù có khi bạn chẳng uống giọt rượu nào. Bạn hay quên, hay nhầm lẫn ngày tháng và luôn cảm thấy thực tại này có chút gì đó... không thật. Bạn lững lờ trôi theo dòng đời, không mục đích rõ rệt nhưng cũng chẳng quá lo âu. Đối với bạn, cuộc đời giống như một giấc mơ dài và bạn chưa muốn tỉnh dậy.', quote: 'Rượu đốt cháy cổ họng. Tỉnh táo chưa bao giờ là một lựa chọn.', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'imfw', code: 'IMFW', name: 'Hệ Mỏng Manh', english: 'The Fragile Soul', desc: 'IMFW (I’m Fing Weak) đại diện cho sự tự nhận thức về sự yếu đuối của bản thân. Bạn không cố gắng tỏ ra mạnh mẽ; bạn thừa nhận mình dễ vỡ, dễ khóc và cần được bảo vệ. Trong khi người khác cố gắng gồng mình, bạn chọn cách thành thật với sự "yếu đuối" của mình, điều này đôi khi lại chính là sức mạnh độc nhất giúp bạn nhận được sự hỗ trợ từ mọi người xung quanh.', quote: 'Tôi thực sự... vô dụng đến thế sao?', color: 'bg-pink-50 text-pink-700 border-pink-200' }
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'test' | 'result' | 'types' | 'typeDetail' | 'about'>('home');
  const [selectedType, setSelectedType] = useState<typeof personalityTypes[0] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultType, setResultType] = useState<typeof personalityTypes[0] | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const engineRef = useRef<SBTIEngine | null>(null);

  const handleStartTest = () => {
    const engine = new SBTIEngine(allQuestions);
    const questions = engine.generateTest(30);
    engineRef.current = engine;
    setTestQuestions(questions);
    setCurrentQuestion(0);
    setAnswers({});
    setView('test');
    window.scrollTo(0, 0);
  };

  const handleAnswerSelect = (questionId: number, tag: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: tag }));
    if (engineRef.current) {
      engineRef.current.recordAnswer(questionId, tag);
    }
    
    // Auto advance after a short delay
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    setIsCalculating(true);
    setView('result');
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      if (engineRef.current) {
        const finalVibe = engineRef.current.calculateResult();
        const mainVibe = finalVibe.mainVibe;
        
        let matchedType = personalityTypes.find(t => t.code === mainVibe);
        if (!matchedType) {
          matchedType = personalityTypes.find(t => t.code.toLowerCase() === mainVibe.toLowerCase());
        }
        if (!matchedType) {
          matchedType = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
        }
        
        setResultType(matchedType);
      }
      setIsCalculating(false);
    }, 2500);
  };

  const handleRetake = () => {
    setView('home');
    setResultType(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => setView('home')} className="flex items-center gap-2 focus:outline-none">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight">SBTI</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <Globe className="w-4 h-4" />
                <span>VI</span>
              </button>
              {view === 'home' && (
                <button 
                  onClick={handleStartTest}
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Làm bài kiểm tra
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Phiên bản tiếng Việt chính thức
                      </span>
                      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                        Trắc nghiệm tính cách <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SBTI trực tuyến</span>
                      </h1>
                      <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Khám phá kiểu tính cách của bạn, so sánh với 27 kết quả khác nhau và đọc hồ sơ 15 khía cạnh chi tiết hoàn toàn miễn phí.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                          onClick={handleStartTest}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                        >
                          Bắt đầu bài kiểm tra
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { setView('types'); window.scrollTo(0, 0); }}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                        >
                          Xem 27 kiểu tính cách
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
              </section>

              {/* Personality Types Preview */}
              <section className="py-16 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Khám phá bản thân</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900">Gặp gỡ các kiểu tính cách</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {personalityTypes.slice(0, 3).map((type, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-4 ${type.color}`}>
                          Kiểu phổ biến
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.name}</h3>
                        <p className="text-gray-600">{type.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* The 5 Models Section */}
              <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        SBTI sử dụng 15 khía cạnh qua 5 mô hình tính cách.
                      </h2>
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Hệ thống của chúng tôi không chỉ phân loại bạn vào một chiếc hộp. Chúng tôi phân tích sâu vào 5 lĩnh vực cốt lõi của tâm lý con người để tạo ra một hồ sơ toàn diện và chính xác nhất về bạn.
                      </p>
                      <div className="space-y-6">
                        {models.map((model, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                {model.icon}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">{model.title}</h4>
                              <p className="mt-1 text-gray-600">{model.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-16 lg:mt-0 relative">
                      <div className="aspect-square rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 absolute inset-0 -z-10 blur-3xl opacity-50"></div>
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Kết quả chi tiết</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Hướng ngoại', value: 75, color: 'bg-blue-500' },
                            { label: 'Trực giác', value: 60, color: 'bg-purple-500' },
                            { label: 'Cảm xúc', value: 85, color: 'bg-pink-500' },
                            { label: 'Nguyên tắc', value: 40, color: 'bg-green-500' },
                          ].map((stat, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-sm font-medium mb-1">
                                <span className="text-gray-700">{stat.label}</span>
                                <span className="text-gray-900">{stat.value}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${stat.value}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                  className={`h-2.5 rounded-full ${stat.color}`}
                                ></motion.div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-600">
                              Sau khi làm bài, bạn có thể đưa kết quả của mình vào bảng xếp hạng toàn trang để so sánh với cộng đồng.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Bạn mới biết đến trắc nghiệm SBTI?
                    </h2>
                    <p className="text-lg text-gray-600">
                      Hãy bắt đầu với những câu hỏi thường gặp này.
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    {faqs.map((faq, idx) => (
                      <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-20 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Sẵn sàng khám phá bản thân?
                  </h2>
                  <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                    Tham gia cùng hàng ngàn người khác đã khám phá ra kiểu tính cách thực sự của họ. Bài kiểm tra hoàn toàn miễn phí và chỉ mất 10 phút.
                  </p>
                  <button 
                    onClick={handleStartTest}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-full hover:bg-gray-50 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Làm bài kiểm tra ngay
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'test' && testQuestions.length > 0 && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="mb-8">
                <button 
                  onClick={() => setView('home')}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Quay lại trang chủ
                </button>
                
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Bài kiểm tra SBTI</h2>
                  <span className="text-sm font-medium text-gray-500">
                    {currentQuestion + 1} / {testQuestions.length}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: `${(currentQuestion / testQuestions.length) * 100}%` }}
                    animate={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-medium text-center text-gray-900 mb-12 leading-relaxed">
                      {testQuestions[currentQuestion].question}
                    </h3>

                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                      {testQuestions[currentQuestion].options.map((option, index) => {
                        const isSelected = answers[testQuestions[currentQuestion].id] === option.tag;
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(testQuestions[currentQuestion].id, option.tag)}
                            className={`w-full p-6 text-left border-2 rounded-2xl transition-all font-medium text-lg shadow-sm hover:shadow-md flex items-center gap-4
                              ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-700 hover:border-blue-300 hover:bg-gray-50'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'}`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            {option.text}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-10 flex flex-wrap items-center gap-4 justify-center md:justify-start border-t border-gray-100 pt-8">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Quay lại
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!answers[testQuestions[currentQuestion].id]}
                    className="px-6 py-2.5 rounded-full bg-[#84a99c] text-white font-medium hover:bg-[#73988b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Tiếp tục
                  </button>
                  <button 
                    onClick={handleStartTest}
                    className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Trộn lại
                  </button>
                  <button 
                    onClick={() => setView('home')}
                    className="px-6 py-2.5 text-gray-900 font-bold hover:text-gray-600 transition-colors ml-auto"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              {isCalculating ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang phân tích kết quả...</h2>
                  <p className="text-gray-500">Hệ thống đang xử lý 15 khía cạnh tính cách của bạn</p>
                </div>
              ) : resultType ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
                      Kết quả của bạn
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                      {resultType.name}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      {resultType.desc}
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
                    <div className="p-8 md:p-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ 15 khía cạnh của bạn</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {[
                          { label: 'Hướng ngoại vs Hướng nội', value: Math.floor(Math.random() * 60) + 20, color: 'bg-blue-500' },
                          { label: 'Trực giác vs Thực tế', value: Math.floor(Math.random() * 60) + 20, color: 'bg-purple-500' },
                          { label: 'Cảm xúc vs Lý trí', value: Math.floor(Math.random() * 60) + 20, color: 'bg-pink-500' },
                          { label: 'Linh hoạt vs Nguyên tắc', value: Math.floor(Math.random() * 60) + 20, color: 'bg-green-500' },
                          { label: 'Độc lập vs Hợp tác', value: Math.floor(Math.random() * 60) + 20, color: 'bg-amber-500' },
                          { label: 'Cẩn trọng vs Mạo hiểm', value: Math.floor(Math.random() * 60) + 20, color: 'bg-indigo-500' },
                        ].map((stat, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-sm font-medium mb-2">
                              <span className="text-gray-700">{stat.label}</span>
                              <span className="text-gray-900">{stat.value}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                                className={`h-3 rounded-full ${stat.color}`}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-sm text-gray-600">Chia sẻ kết quả này với bạn bè để xem họ thuộc kiểu nào!</p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          Sao chép liên kết
                        </button>
                        <button 
                          onClick={handleRetake}
                          className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <RefreshCcw className="w-4 h-4" />
                          Làm lại
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
          {view === 'types' && (
            <motion.div
              key="types"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="mb-12">
                <button 
                  onClick={() => setView('home')}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Quay lại trang chủ
                </button>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  27 Kiểu Tính Cách SBTI
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl">
                  Khám phá tất cả 27 kiểu tính cách trong hệ thống SBTI. Mỗi kiểu đại diện cho một sự kết hợp độc đáo của 15 khía cạnh tính cách.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalityTypes.map((type, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 10) * 0.05 }}
                    onClick={() => {
                      setSelectedType(type);
                      setView('typeDetail');
                      window.scrollTo(0, 0);
                    }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${type.color}`}>
                        {type.code}
                      </div>
                      <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">Chi tiết &rarr;</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-3">{type.english}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{type.desc}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm italic text-gray-500">"{type.quote}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {view === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  SBTI là gì?
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Hướng dẫn về bài kiểm tra tính cách SBTI, 27 kiểu tính cách, và sự khác biệt so với MBTI.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Bài kiểm tra tính cách SBTI là gì?</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  SBTI, viết tắt của Silly Big Personality Test (Bài kiểm tra tính cách lớn ngớ ngẩn), là một bài trắc nghiệm tính cách mang đậm chất văn hóa mạng (internet-native) được xây dựng để mô tả cách mọi người thực sự đối phó, trì hoãn, ám ảnh, gắn bó, né tránh và hoạt động trong cuộc sống thực. Nó giống một tấm gương phản chiếu hành vi sắc bén hơn là ngôn ngữ nhân sự cứng nhắc của các bài kiểm tra truyền thống.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Nếu bạn đã từng thấy các mã kết quả như DEAD, IMSB, MALO hay DRUNK nhưng vẫn chưa hiểu rõ SBTI đang đo lường điều gì, trang này sẽ cung cấp cho bạn toàn bộ bản đồ: SBTI đến từ đâu, bài kiểm tra được chấm điểm như thế nào, tại sao lại có 27 kết quả và nó đứng ở đâu so với MBTI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-blue-600 font-bold text-xl mb-2">31 bước hiển thị</div>
                    <p className="text-gray-700 text-sm">Hầu hết các lần làm bài dừng ở đó; chỉ có nhánh liên quan đến đồ uống mới chèn thêm một câu hỏi ẩn.</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="text-purple-600 font-bold text-xl mb-2">15 khía cạnh / 5 mô hình</div>
                    <p className="text-gray-700 text-sm">Kết quả được xây dựng từ hồ sơ đa chiều trước, sau đó được tóm tắt thành các mẫu tính cách rộng hơn.</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-emerald-600 font-bold text-xl mb-2">27 kết quả</div>
                    <p className="text-gray-700 text-sm">Bao gồm 25 tính cách tiêu chuẩn cộng với 2 kết quả đặc biệt có logic kích hoạt riêng.</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">Thực chất SBTI là gì?</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Cách dễ nhất để nghĩ về SBTI là: một khuôn khổ tính cách với sự am hiểu về meme. Nó giữ lại niềm vui của việc phân loại con người, nhưng dịch trải nghiệm đó sang ngôn ngữ của sự trì hoãn, phong cách gắn bó, tổn thương cảm xúc, suy nghĩ quá nhiều (overthinking), khả năng thực thi và hiệu suất xã hội.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Đó là lý do tại sao SBTI mang lại cảm giác khác biệt so với các hệ thống phân loại bóng bẩy khác. Nó ít quan tâm đến việc gắn cho bạn một nhãn mác đáng kính mà quan tâm nhiều hơn đến việc nắm bắt hình dạng hành vi hàng ngày của bạn. Không phải phiên bản lý tưởng hóa của bạn. Mà là phiên bản của bạn nhắn tin quá nhiều, biến mất trong hai ngày, bắt đầu ba kế hoạch cùng một lúc và sau đó rơi vào vòng xoáy theo một cách rất cụ thể.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">Cách SBTI hoạt động: từ câu hỏi đến kết quả</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  SBTI nghe có vẻ không nghiêm túc một cách có chủ đích, nhưng luồng hoạt động bên dưới không hề ngẫu nhiên. Hệ thống di chuyển qua một trình tự rõ ràng:
                </p>
                <ul className="space-y-4 mb-12">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Đầu tiên là luồng câu hỏi hiển thị</h4>
                      <p className="text-gray-600">Một lần làm bài bình thường bao gồm 31 bước hiển thị. Chỉ khi bạn chọn tùy chọn liên quan đến việc uống rượu, trang web mới chèn thêm một câu hỏi ẩn.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Sau đó hệ thống xây dựng hồ sơ 15 khía cạnh</h4>
                      <p className="text-gray-600">Mỗi câu hỏi chính đóng góp vào một khía cạnh. Trước khi trang web hiển thị nhãn tính cách, nó sẽ phân giải kết quả của bạn thành các mức cao, trung bình hoặc thấp trên 15 khía cạnh.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Cuối cùng, 1 trong 27 kết quả được chỉ định</h4>
                      <p className="text-gray-600">Hồ sơ đa chiều của bạn được so sánh với 25 tính cách tiêu chuẩn. Chỉ khi một điều kiện ẩn ghi đè lên đường dẫn bình thường, hoặc khi thư viện bình thường không khớp đủ mạnh, hệ thống mới chuyển sang 1 trong 2 kết quả đặc biệt.</p>
                    </div>
                  </li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">SBTI vs MBTI: Sự khác biệt không chỉ ở giọng điệu</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Mọi người thường tóm tắt SBTI là "phiên bản hài hước của MBTI". Điều đó không hoàn toàn sai, nhưng nó bỏ sót quá nhiều thứ. Cả hai hệ thống đều phân loại tính cách, nhưng chúng tập trung vào các bề mặt khác nhau của một người và nói bằng những giọng điệu rất khác nhau.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">SBTI</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li><strong className="text-gray-900">Ngôn ngữ:</strong> Lỏng lẻo hơn, sắc bén hơn, giống như một người bạn đang đọc to cuộc đời bạn.</li>
                      <li><strong className="text-gray-900">Điều nó chú ý:</strong> Hành vi hàng ngày, phản ứng xã hội, kiểu gắn bó, phong cách thực thi và rối loạn chức năng thời đại internet.</li>
                      <li><strong className="text-gray-900">Trường hợp sử dụng tốt nhất:</strong> Tuyệt vời khi bạn muốn có một cái nhìn sống động về việc bạn thực sự như thế nào trong thực tế ngay lúc này.</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">MBTI</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li><strong className="text-gray-900">Ngôn ngữ:</strong> Trang trọng hơn, ổn định hơn, gắn liền với ngôn ngữ phân loại cổ điển hơn.</li>
                      <li><strong className="text-gray-900">Điều nó chú ý:</strong> Sở thích nhận thức, xử lý thông tin và các cuộc thảo luận về loại hình dài hạn hơn.</li>
                      <li><strong className="text-gray-900">Trường hợp sử dụng tốt nhất:</strong> Hữu ích khi bạn muốn có một khuôn khổ bền vững để thảo luận về sở thích tính cách theo thời gian.</li>
                    </ul>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed italic text-center">
                  Thay vì hỏi cái nào thay thế cái nào, tốt hơn là coi chúng như những thấu kính khác nhau. MBTI là góc máy rộng về cấu trúc. SBTI là góc máy cận cảnh bắt trọn tính cách của bạn thực sự trông như thế nào khi nó va chạm với cuộc sống hàng ngày.
                </p>
              </div>
            </motion.div>
          )}
          
          {view === 'typeDetail' && selectedType && (
            <motion.div
              key="typeDetail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <button 
                onClick={() => setView('types')}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại danh sách
              </button>
              
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold border mb-6 ${selectedType.color}`}>
                    {selectedType.code}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                    {selectedType.name}
                  </h1>
                  <h2 className="text-xl text-gray-500 font-medium mb-6">
                    {selectedType.english}
                  </h2>
                  <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
                    {selectedType.desc}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10 text-center relative">
                  <div className="absolute top-4 left-4 text-4xl text-gray-300 font-serif">"</div>
                  <p className="text-lg md:text-xl italic text-gray-700 relative z-10 font-medium">
                    {selectedType.quote}
                  </p>
                  <div className="absolute bottom-4 right-4 text-4xl text-gray-300 font-serif rotate-180">"</div>
                </div>
                
                <div className="border-t border-gray-100 pt-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hồ sơ 15 khía cạnh tính cách</h3>
                  <p className="text-gray-600 text-center mb-8">
                    Dưới đây là biểu đồ mô phỏng 15 khía cạnh tính cách đặc trưng của {selectedType.name}.
                  </p>
                  
                  <div className="space-y-4">
                    {dimensions.map((dim, idx) => {
                      // Generate a deterministic but pseudo-random value based on the type's id and dimension index
                      const seed = selectedType.id.charCodeAt(0) + selectedType.id.charCodeAt(selectedType.id.length - 1) + idx;
                      const value = 20 + (seed % 70); // Value between 20 and 90
                      
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-gray-700 text-right">{dim.name}</div>
                          <div className="flex-grow h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 1, delay: 0.5 + (idx * 0.05) }}
                              className={`h-full ${dim.color}`}
                            />
                          </div>
                          <div className="w-12 text-sm font-bold text-gray-900">{value}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={handleStartTest}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                  >
                    Làm bài kiểm tra để xem bạn có phải là {selectedType.name}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight">SBTI</span>
              </div>
              <p className="text-sm max-w-sm">
                Nền tảng trắc nghiệm tính cách hiện đại, giúp bạn hiểu rõ bản thân và phát triển các mối quan hệ tốt đẹp hơn.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Khám phá</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleStartTest} className="hover:text-white transition-colors">Làm bài kiểm tra</button></li>
                <li><button onClick={() => { setView('types'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">27 Kiểu tính cách</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảng xếp hạng</a></li>
                <li><button onClick={() => { setView('about'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Về chúng tôi</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} SBTI. Đã đăng ký bản quyền.</p>
            <div className="flex items-center gap-4">
              <span>Ngôn ngữ:</span>
              <button className="text-white font-medium flex items-center gap-1">
                Tiếng Việt <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
